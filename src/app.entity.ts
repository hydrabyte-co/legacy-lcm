export class App {
  id: string;
  name: string;
  buildAt: number;
  processId: number;

  constructor(id: string, name: string, buildAt: number, processId: number) {
    this.id = id;
    this.name = name;
    this.buildAt = buildAt;
    this.processId = processId;
  }
}
