import { colors, fontSizes } from 'goals-tracker/tokens';
import Toast from 'react-native-toast-message';

class UserError extends Error {
  title: string;
  description?: string;
  constructor(title: string, description?: string) {
    super(title + ': ' + description);
    this.title = title;
    this.description = description;
    this.name = 'UserError';
  }
}

class DeveloperError extends Error {
  title: string;
  constructor(title: string) {
    super('WHY ARE YOU DOING THIS: ' + title);
    this.title = 'WHY ARE YOU DOING THIS: ' + title;
    this.name = 'DeveloperError';
  }
}

export const error = {
  UserError,
  DeveloperError,
  listen<T extends (...args: any) => any>(cb: T): T {
    return ((...args: any[]) => {
      try {
        return cb(...args);
      } catch (err) {
        this.handle(err);
      }
    }) as T;
  },
  listenAsync<T extends (...args: any) => Promise<any>>(cb: T): T {
    return (async (...args: any[]) => {
      try {
        return await cb(...args);
      } catch (err) {
        this.handle(err);
      }
    }) as T;
  },
  handle(error: unknown) {
    console.log('error', error);
    if (error instanceof UserError) {
      Toast.show({
        position: 'bottom',
        type: 'info',
        text1: error.title,
        text2: error.description,
        text1Style: {
          fontFamily: 'Roboto',
          fontSize: fontSizes['md'],
          color: colors['black'],
        },
        text2Style: {
          fontFamily: 'Roboto',
          fontSize: fontSizes['sm'],
          color: colors['black'],
        },
      });
    } else if (error instanceof DeveloperError) {
      Toast.show({
        position: 'bottom',
        type: 'error',
        text1: error.message,
        text1Style: {
          fontFamily: 'Roboto',
          fontSize: fontSizes['md'],
          color: colors['black'],
        },
      });
      console.error(error);
    } else {
      console.error(error);
    }
  },
};
