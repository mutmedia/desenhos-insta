import fs from 'fs'
import fetch from 'node-fetch'
import Jimp from 'jimp'

const urls = [
  "https://igstorie.com/highlights/17873294839250012",
  "https://igstorie.com/highlights/17950618423150060",
  "https://igstorie.com/highlights/17995910242019424",
  "https://igstorie.com/highlights/18068105332015723",
]
const regex = /href="([^"]*?)">Download/g

const main = async () => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const respose = await fetch(url)
    const body = await respose.text()
    const imageTags = body.match(regex)
    const imageUrls = imageTags.map(tag => tag.replace(regex, "$1"))
    for (let j = 0; j < imageUrls.length; j++) {
      console.log("img ... ", i, " ", j)
      const imageUrl = imageUrls[j]
      if(imageUrl.match(/\.mp4/g)) {
        console.log("skipped")
        continue;
      }
      var img = (await Jimp.read(imageUrl))
              .resize(Jimp.AUTO, 1024)
      var result = await new Jimp(1024, 1024, 0x000000ff)
      await result
              .blit(img, 512 - img.bitmap.width/2, 0)
              .quality(100)
              .write(`./downloads/${i}_${j}.png`)

      var image = await Jimp.read(`./downloads/${i}_${j}.png`)
      image.rgba(false)
      await image.write(`./downloads/${i}_${j}.png`)
      console.log("done")
    }
  }
}

main()