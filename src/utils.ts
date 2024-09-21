import { launch, type Page } from 'puppeteer';
import inputs from '../input.json';

export const delay = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const evaluate = async (page: Page, selector: string, query: string) => {
  if (!page || !selector || !query) {
    return;
  }

  await page.evaluate(
    (selector, query) => {
      const elements = Array.from(document.querySelectorAll(selector));

      const targetElement = elements.find((element) =>
        element.textContent?.includes(query)
      );
      if (targetElement) {
        return (targetElement as HTMLElement).click();
      }
    },
    selector,
    query
  );

  await delay(1000);
};

export const addVote = async (surveyUrl?: string, votes: number = 1) => {
  if (!surveyUrl) {
    throw new Error('SURVEY_URL is required.');
  }

  for (let i = 0; i < votes; i++) {
    console.log('Starting survey.');

    const browser = await launch();
    const page = await browser.newPage();

    await page.goto(surveyUrl);

    inputs.forEach(async (input) => {
      await evaluate(page, input.selector, input.query);
    });

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await delay(1000);

    await evaluate(page, 'button', 'DONE');
    await page.waitForNavigation();
    await delay(1000);

    await browser.close();

    console.log(`Survey completed ${i + 1} ${i === 0 ? 'time' : 'times'}.`);

    const randomTime = Math.floor(Math.random() * 5) + 1;
    console.log(`Waiting for ${randomTime} seconds.`);
    await delay(randomTime * 1000);
  }
};
