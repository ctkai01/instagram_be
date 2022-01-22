export class BaseResource {
  constructor(data: any) {
    this.toArray(data);
  }

  protected toArray(data: any) {
    return data;
  }
}
