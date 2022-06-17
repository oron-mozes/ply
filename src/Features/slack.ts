#! /usr/bin/env node

import axios from 'axios';
import { slackApiBaseUrl } from '../../consts';
import { ACTION } from '../../types';

export const sendProcessEndMessage = async (user: string, action: ACTION) => {
  await axios.get(`${slackApiBaseUrl}/slack-user-message?user=${user}&message=${action.toLowerCase()} process is done`)
}

export const groupUsersInChannel = async () => {

}