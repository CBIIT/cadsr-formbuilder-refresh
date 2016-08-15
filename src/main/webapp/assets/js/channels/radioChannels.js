import Radio from 'backbone.radio';

export const appChannel = Radio.channel('appEvents');
export const searchChannel = Radio.channel('search');
