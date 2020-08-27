const { WebClient } = require('@slack/web-api')
const cheerio = require('cheerio')
const axios = require('axios')

let samsung_url =
  'https://df.olx.com.br/distrito-federal-e-regiao/brasilia/celulares/samsung?q=s10&sf=1'

sendMessage = async (link, foto, titulo, preco, local, data) => {
  const token = 'xoxb-1323035210197-1326141891794-6XiWjQbl9Xq1WCfQueToFO4v'

  const web = new WebClient(token)

  const conversationId = 'C019SH50FL4'

  // See: https://api.slack.com/methods/chat.postMessage
  const res = await web.chat.postMessage({
    channel: conversationId,
    text: `
  ${foto}

  titulo: ${titulo}
  preço: ${preco}
  local: ${local}
  data: ${data}
  \n
  `,
  })
}
;(async () => {
  let res_page = await axios.get(samsung_url)

  let $ = cheerio.load(res_page.data)

  lista_informacoes = $('#ad-list')

  lista_informacoes.find('a').each(function (item, element) {
    let caminho_A_foto = $(this).find('div > div > div').find('img').attr('src')
    let caminho_B_foto = $(this)
      .find('div > div > div')
      .find('img')
      .attr('data-src')

    const condicao_caminho_B_foto =
      'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

    let foto =
      caminho_A_foto.trim() !== condicao_caminho_B_foto
        ? caminho_A_foto
        : caminho_B_foto

    let link = $(this).attr('href')
    let titulo = $(this).attr('title')
    let preco = $(this)
      .find('div > :nth-child(2) > div:nth-child(1) > div:nth-child(2)')
      .text()
    let local = $(this)
      .find('div > :nth-child(2) > :nth-child(2) > div > :nth-child(1)')
      .text()
    let data = $(this)
      .find('div > :nth-child(2) > :nth-child(1) > :nth-child(3)')
      .text()

    console.log('\n')
    console.log('link: ', link)
    console.log('imagem: ', foto)
    console.log('titulo: ', titulo)
    console.log('preco: ', preco)
    console.log('local: ', local)
    console.log('data: ', data)

    sendMessage(link, foto, titulo, preco, local, data)
  })
})()