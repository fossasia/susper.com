import { SusperPage } from './app.po';

describe('susper App', function() {
  let page: SusperPage;

  beforeEach(() => {
    page = new SusperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
