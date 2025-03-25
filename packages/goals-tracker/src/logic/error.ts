export class BusinessError extends Error {
  title: string;
  description?: string;

  constructor(title: string, description?: string) {
    super(title + ': ' + description);
    this.title = title;
    this.description = description;
    this.name = 'BusinessError';
  }
}

export const error = {
  BusinessError,
};
