import Radio from 'backbone.radio';

export const appChannel = Radio.channel('appEvents');
export const searchChannel = Radio.channel('search');
export const formChannel = Radio.channel('form');
export const userChannel = Radio.channel('user');
export const cartChannel = Radio.channel('cart');