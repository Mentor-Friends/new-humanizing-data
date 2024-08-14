import mainViewClass from "../../default/mainView.class";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle('Posts');
  }

  async getHtml(): Promise<string> {
    const product = await fetch(`https://fakestoreapi.com/products/2`)
      .then(res => res.json())
      .then(json => {
        return json;
      });
    if (product) {
      return `
      <h1>Welcome back, Post</h1>
      <p>
        lorem ipsum
      </p>
      <p>${product.title} - title</p>
    `;
    }
    return '';
  }
}