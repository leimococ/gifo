import chalk from 'chalk'
import figures from 'figures'
import puppeteer from 'puppeteer-core'
import randomWords from 'random-words'

import 'dotenv/config'

const terms = [
  '420',
  'argentina',
  'beach',
  'beatles',
  'beautiful',
  'beer',
  'bitcoin',
  'blooper',
  'buenos aires',
  'cat',
  'cerveza',
  'chess',
  'city',
  'coder',
  'coding',
  'coffee',
  'couch',
  'crypto',
  'dance',
  'dancing girls',
  'dancing',
  'do it',
  'dog',
  'driving',
  'fast food',
  'fractal',
  'funny',
  'girl',
  'hacker',
  'hacking',
  'happy',
  'jazz music',
  'magic',
  'music',
  'party',
  'partying',
  'playing music',
  'pomododro timer',
  'programming',
  'pulp fiction',
  'road trip',
  'rock and roll',
  'sex',
  'sexy girl',
  'sexy girls',
  'sexy',
  'skate',
  'skating',
  'soccer',
  'software',
  'sunrise',
  'sunset',
  'surf',
  'surfing',
  'trading',
  'travelling',
  'woman'
]

const gif = async term => {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: null,
      executablePath: process.env.EXECUTABLE_PATH
    })
    try {
      const page = (await browser.pages())[0]
      await page.goto(`https://www.twitch.tv/${process.env.CHANNEL}`, { waitUntil: 'domcontentloaded' })
      await page.waitForNavigation({ timeout: 3000 })
      const mature = await page.$('button[data-a-target="player-overlay-mature-accept"]')
      if (mature) {
        await mature.click()
      }
      await page.waitForXPath('//div[contains(@class, "extensions-dock-card__image")]', { timeout: 3000 })
      const giphy = (await page.$x('//div[contains(@class, "extensions-dock-card__image")]/following-sibling::div[contains(., "GIPHY")]/preceding-sibling::div[contains(@class, "extensions-dock-card__image")]'))[0]
      if (giphy) {
        await giphy.hover()
        await giphy.focus()
        await giphy.click()
        await page.waitForSelector('div.extensions-dock__layout iframe.extension-view__iframe', { timeout: 3000 })
        const frame = await (await page.$('div.extensions-dock__layout iframe.extension-view__iframe')).contentFrame()
        await frame.waitForSelector('iframe', { timeout: 3000 })
        const frame2 = await (await frame.$('iframe')).contentFrame()
        await frame2.waitForSelector('div.giphy-search-bar > input', { timeout: 3000 })
        await frame2.type('div.giphy-search-bar > input', term)
        await new Promise(resolve => setTimeout(resolve, 3000))
        await frame2.waitForSelector('.giphy-gif', { timeout: 3000 })
        const gifs = shuffle(await frame2.$$('.giphy-gif'))
        if (gifs.length > 0) {
          const gif = gifs[Math.floor(Math.random() * gifs.length)]
          await gif.click()
          await new Promise(resolve => setTimeout(resolve, 2000))
          console.log(`${chalk.green(figures.tick)} ${term}`)
        }
      }
    } catch (error) {
      throw error
    } finally {
      await browser.close()
    }
  } catch (error) {
    console.error(error.toString())
    console.log(`${chalk.red(figures.cross)} ${term}`)
  }
}

const run = () => {
  setTimeout(async () => {
    const [random1, random2] = randomWords(2)
    const term = shuffle(terms)[Math.floor(Math.random() * terms.length)]
    try {
      await gif(
        shuffle([random1, random2, term])
          .slice(0, Math.floor(Math.random() * 3) + 1)
          .join(' ')
      )
    } catch (error) {}
    run()
  }, process.env.DELAY)
}

const shuffle = array => {
  if (Array.isArray(array)) {
    array = [...array]
    for (let i = array.length - 1; i > 0; i--) {
      const index = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[index]] = [array[index], array[i]]
    }
    return array
  }
  return []
}

run()
