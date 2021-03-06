#! /usr/bin/env node

import fs from 'fs';
import { echo } from 'shelljs';
import path from 'path';
import { gameSelectorScreen } from '.';
import inquirer from 'inquirer';
import axios from 'axios';
import { apiBaseUrl } from '../../consts';
import { getUserData } from '../../services';
import chalk from 'chalk';

export const initSpeedType = () => {
    function flagExists(shortFlag: any, longFlag: any) {
        return process.argv.indexOf(`-${shortFlag}`) !== process.argv.indexOf(`--${longFlag}`);
    }

    // Show help if at least one of these flags are present
    if (flagExists('h', 'help')) {
        console.log('Usage:');
        console.log('  cli-typer [options]');
        console.log('\nOptions:');
        console.log('  -t, --time\t\tGiven time in seconds to complete the test');
        console.log('  -w, --words\t\tNumber of words to display per line');
        console.log('  -i, --input\t\tPath to a wordlist file with new line separated words');
        console.log('  -V, --verbose\t\tShow settings on start');
        console.log('  -s, --save\t\tPath to file for saving results');
        console.log('  -h, --help\t\tShow help');
        process.exit();
    }

    const CONFIG = initConfig();

    const stdin = process.stdin;
    const stdout = process.stdout;

    const SPECIAL = {
        CTRL_C: '\u0003',
        BACKSPACE: '\u007f',
        GREEN_BG: '\x1b[42m',
        RED_BG: '\x1b[41m',
        GREEN_TEXT: '\x1b[32m',
        RESET: '\x1b[0m'
    };

    const ALPHANUMERIC = /[\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F]/u;
    const ANSI_ESCAPE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

    const lineGen = lineGenerator(CONFIG.inputFile, CONFIG.wordsPerLine);

    let text: string, nextText: string, cursor: number;

    function removeAnsiEscape(text: string) {
        return text.replace(ANSI_ESCAPE, '');
    }

    function timePad(time: any) {
        return ('00' + time).slice(-2);
    }

    function calcRemainingTime() {
        let allSeconds = CONFIG.givenSeconds - Math.round((Date.now() - startTime) / 1000);
        let minutes = Math.floor(allSeconds / 60);
        let seconds = allSeconds % 60;
        return timePad(minutes) + ':' + timePad(seconds);
    }

    // TODO maybe merge box functions to one
    function boxTop(width = 79) {
        return '???' + '???'.repeat(width - 14) + '??? ' + calcRemainingTime() + ' ???????????????';
    }

    function boxText(text: string, width = 79) {
        const spaceAvailable = width - 4 - removeAnsiEscape(text).length;
        if (spaceAvailable < 0) {
            return '??? ' + text;
        }
        return '??? ' + text + ' '.repeat(spaceAvailable) + ' ???';
    }

    function boxSeparator(width = 79) {
        return '???' + '???'.repeat(width - 2) + '???';
    }

    function boxBottom(width = 79) {
        return '???' + '???'.repeat(width - 2) + '???';
    }

    function drawBox() {
        if (boxDrawIsLocked) {
            return;
        }
        boxDrawIsLocked = true;

        // Erase the whole thing and display the next words to type
        stdout.clearLine(0);
        stdout.moveCursor(0, -2);
        stdout.clearLine(0);
        stdout.moveCursor(0, -1);
        stdout.clearLine(0);
        stdout.moveCursor(0, -1);
        stdout.clearLine(0);
        stdout.cursorTo(0);
        stdout.write(boxTop() + '\n' + boxText(results + text.substring(cursor)) + '\n' + boxText(nextText) + '\n\n??? ' + wrote);

        boxDrawIsLocked = false;
    }

    function printStatsAndSendResults() {
        STATS.wpm = Math.round(STATS.corrects / 5 * (60 / CONFIG.givenSeconds));
        STATS.accuracy = Math.round(STATS.corrects / STATS.keypresses * 10000) / 100;

        console.log(' '.repeat(79 - 3 - wrote.length) + '???\n' + boxSeparator());
        console.log(boxText('Time\'s up!'));
        console.log(boxText(`WPM: ${STATS.wpm}`));
        console.log(boxText(`All keystrokes: ${STATS.keypresses}`));
        console.log(boxText(`Correct keystrokes: ${STATS.corrects}`));
        console.log(boxText(`Wrong keystrokes: ${STATS.errors}`));
        console.log(boxText(`Accuracy: ${STATS.accuracy}%`));
        console.log(boxBottom());
    }

    function initConfig() {
        const textFilePath = `${path.resolve(__dirname, '../../../../')}/speedTypeData/mostCommon1000.txt`;
     
        return {
            wordsPerLine: argvParser(['-w', '--words'], 9, validateIntArg),
            givenSeconds: argvParser(['-t', '--time'], 45, validateIntArg),
            inputFile: argvParser(['-i', '--input'], textFilePath),
            verbose: flagExists('V', 'verbose'),
            debug: flagExists('d', 'debug'),
            savePath: argvParser(['-s', '--save'], false)
        };
    }

    function plural(times: any, noun: any) {
        const output = `${times} ${noun}`;
        return times !== 1 ? output + 's' : output;
    }

    function printConfig(config: any) {
        console.log(boxTop());
        console.log(boxText('Settings'));
        console.log(boxSeparator());
        console.log(boxText(plural(config.givenSeconds, 'second')));
        console.log(boxText(`${plural(config.wordsPerLine, 'word')} per line`));
        console.log(boxText(`Input: ${config.inputFile}`));
        if (config.savePath !== false) {
            console.log(boxText(`Save path: ${config.savePath}`));
        }
        console.log(boxBottom());
    }

    function validateIntArg(flags: string[], arg: string) {
        const intArg = parseInt(arg, 10);
        if (isNaN(intArg)) {
            console.log(`"${arg}"\n${flags.join(', ')} arg should be a whole number.\n`);
            return false;
        }
        if (intArg < 1) {
            console.log(`${flags.join(', ')} must be higher than 0. Set to default.\n`);
            return false;
        }
        return !!intArg;
    }

    function argvParser(flags: string[], dflt: any, validateFunction?: typeof validateIntArg) {
        for (let flag of flags) {
            if (process.argv.indexOf(flag) !== -1) {
                const param = process.argv[process.argv.indexOf(flag) + 1];
                if (!validateFunction) {
                    return param;
                }
                const validatedParam = validateFunction(flags, param);
                if (!validatedParam) {
                    break;
                }
                return validatedParam;
            }
        }
        return dflt;
    }

    function random(min: number, max: number) {
        if (max === null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function shuffle(obj: any) {
        let sample = obj.slice();
        const last = sample.length - 1;
        for (let index = 0; index < sample.length; index++) {
            let rand = random(index, last);
            let temp = sample[index];
            sample[index] = sample[rand];
            sample[rand] = temp;
        }
        return sample.slice();
    }

    function* lineGenerator(path: any, numberOfWords: any) {
        const words = fs.readFileSync(path, 'utf8').split('\n');
        const shuffledWords = shuffle(words);
        for (let i = 0; i + numberOfWords < shuffledWords.length - 1; i += numberOfWords) {
            yield shuffledWords.slice(i, i + numberOfWords).join(' ');
        }
    }

    // TODO tidy up
    function saveStats(stats: any, config: any) {
        const date = new Date(startTime).toLocaleString();
        const headers = 'Date\tLength (seconds)\tWPM\tKeystrokes\tCorrect\tWrong\tAccuracy\tInput\n';
        const content = [date, config.givenSeconds, stats.wpm, stats.keypresses, stats.corrects,
            stats.errors, stats.accuracy, config.inputFile].join('\t') + '\n';

        let data;
        try {
            fs.statSync(config.savePath).isFile();
            // If the file exists, assume headers have already been written
            data = content;
        } catch (exception: any) {
            if (exception.code === 'ENOENT') {
                // Since the file does not exist, write the headers as well
                data = headers + content;
            } else {
                throw exception;
            }
        }

        fs.appendFileSync(config.savePath, data);
    }

    function start() {
        setTimeout(async () => {
            printStatsAndSendResults();
            boxDrawIsLocked = true;
            const { id } = getUserData();

            const {avgWpm, bestWpm, firstPlaceUserId, firstPlaceUserEmail} = await (await axios.get(`${apiBaseUrl}/speedTypeScore`)).data.items;
            await axios.post(`${apiBaseUrl}/speedTypeScore`, {
                userId: id,
                wpm: STATS.wpm,
            });

            if (STATS.wpm > bestWpm) {
                if (id === firstPlaceUserId) {
                    // cungrats - brok your record.
                    console.log(`Congratulations! you broke your previous record of ${chalk.greenBright(`${bestWpm} WPM`)}\nand you are still ${chalk.bold(chalk.greenBright('leading the board'))}`)
                } else {
                    // cungrats - new leader.
                    console.log(`Congratulations! ${chalk.bold(chalk.greenBright('you overtook the throne!'))}\nYou have beaten ${chalk.redBright(firstPlaceUserEmail)}\'s previous record of ${chalk.redBright(`${bestWpm} WPM`)}\nThe new score is ${chalk.greenBright.bold(`${STATS.wpm} WPM`)}`)
                }
            } else if (STATS.wpm > avgWpm) {
                // better then most users
                console.log(`Doing great! you passed the average of ${chalk.greenBright(`${avgWpm} WPM`)}\nBut still need to do better to pass ${chalk.yellowBright(firstPlaceUserEmail)}\'s record of ${chalk.yellowBright(`${bestWpm} WPM`)}`)
            } else {
                // get some practice :) run it again.
                console.log(`Nice try! but you need to ${chalk.redBright('warm up')} to at least pass the average ${chalk.yellowBright(`${avgWpm} WPM`)}\nAnd have a lot to go to pass ${chalk.yellowBright(firstPlaceUserEmail)}\'s record of ${chalk.yellowBright(`${bestWpm} WPM`)}`)
            }
            
            const answer = await inquirer.prompt({
                name: 'rematch',
                message: 'Do you want to ply another game?',
                choices: ['YES', 'NO'],
                type: "list",
              });
              console.clear();
              if (answer.rematch === 'NO') {
                  gameSelectorScreen();
              } else {
                initSpeedType()
              }
        }, CONFIG.givenSeconds * 1000);
        setInterval(drawBox, 250);
        startTime = Date.now();
        started = true;
    }


    // The upper text which shows what to type
    let results = '';
    let interResults = '';
    // The lower text which shows what you typed
    let wrote = '';
    let started = false;
    let startTime = Date.now();
    let boxDrawIsLocked = false;

    // TODO explicit code / variable name standards
    let STATS = {
        corrects: 0,
        errors: 0,
        keypresses: 0,
        wpm: 0,
        accuracy: 0
    };


    // Skip waiting for the first char on debug
    if (CONFIG.debug) {
        start();
    }

    stdin.on('data', key => {
        if (!started) {
            start();
        }

        // Exit on ctrl-c
        if (key.toString() === SPECIAL.CTRL_C) {
            process.exit();
        } else if (key.toString() === SPECIAL.BACKSPACE) {
            // Do nothing on the beginning of the line
            if (cursor === 0) { return; }

            // Remove error from stats for a more fair calculation
            if (interResults.slice(-1) === 'x') {
                STATS.errors--;
            } else {
                STATS.corrects--;
            }
            STATS.keypresses--;

            wrote = wrote.slice(0, -1);
            interResults = interResults.slice(0, -1);
            // The last char with the colored background takes up 10 characters
            results = results.slice(0, -10);
            cursor--;
        } else if (cursor >= text.length) {
            text = nextText;
            nextText = lineGen.next().value;
            cursor = 0;
            wrote = '';
            results = '';
        } else if (!ALPHANUMERIC.test(key.toString())) {
            // Return on non-alphanumeric unicode characters
            // Regex generated with: http://kourge.net/projects/regexp-unicode-block
            return;
        } else {
            wrote += key;

            if (key.toString() === text[cursor]) {
                interResults += 'o';
                results += SPECIAL.GREEN_BG;
                STATS.corrects++;
            } else {
                interResults += 'x';
                results += SPECIAL.RED_BG;
                STATS.errors++;
            }
            results += text[cursor] + SPECIAL.RESET;
            cursor++;
            STATS.keypresses++;
        }

        drawBox();
    });

    const play = () => {
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');

        if (CONFIG.verbose) {
            printConfig(CONFIG);
        }
        console.log('\n  Start typing the words below:\n');

        text = lineGen.next().value;
        nextText = lineGen.next().value;

        process.stdout.write(boxTop() + '\n' + boxText(text) + '\n' + boxText(nextText) + '\n' + boxSeparator() + '\n??? ');
        cursor = 0;
    }

    play();
}