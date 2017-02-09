import { HotOrNotPage } from './app.po';

describe('hot-or-not App', function() {
  let page: HotOrNotPage;

  beforeEach(() => {
    page = new HotOrNotPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
