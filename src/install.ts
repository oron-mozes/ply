const execSync = require('child_process').execSync;
try {
  let options = {stdio : 'pipe' };
  let stdout = execSync('bash ./scripts/install.sh' , options);
  console.log("I got success: " + stdout);
  execSync('rmdir doesntexist' , options);//will exit failure and give stderr
} catch (e:any) {
  console.error("I got error: " + e.stderr ) ;
}