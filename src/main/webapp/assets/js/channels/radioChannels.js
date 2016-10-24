import Radio from 'backbone.radio';

/**
 * a channel is Backbone Radio enhancement on top standard Backbone events that separates BB events into separate message buses, or channels, that help keep different sections of an app separated and decoupled.
 * See http://benmccormick.org/2015/01/26/backbone-radio/
 */
/**
 * appChannel is meant for communicating between views or other functionality handle by one particular Service to another handled by a different service
 */
export const appChannel = Radio.channel('appEvents');
export const searchChannel = Radio.channel('search');
export const formChannel = Radio.channel('form');
export const userChannel = Radio.channel('user');
export const cartChannel = Radio.channel('cart');