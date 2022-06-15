import axios from 'axios';
import { Action } from './types';

export const sendActionDuration = async (
  userId: string,
  packageName: string,
  action: Action,
  time: string) => {
  const { data } = await axios.post('some-url', { userId, packageName, action, time });
}
