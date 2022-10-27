/**Importa CSS */
import "./css/index.css"
/***Import imask para fazer usar expressões regulares */
import IMask from "imask"

/**Pega elemento do HTML Para alterar a cor do cartão da parte superior central*/
const ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
/**Pega logo da bandeira do cartão do html nth é para selecionar uma tag filha*/
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  /** Estrutura de dados que recebe array de cores para cartões visa e mastercard, e vamos deixar um default*/
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "C69347"],
    default: ["black", "gray"]
  }

  /**Pega atributo fill do Html para alterar a cor do cartão, onde color é o array de objetos e type é o argumento que foi passado para função, e acessa a posição da cor no array de objetos */
  ccBgColor1.setAttribute("fill", colors[type][0])
  ccBgColor2.setAttribute("fill", colors[type][1])

  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

/**Função que muda as cores do cartão se chamado visa, mastercard ou default */
setCardType("default")

/**Torna afunção setCardType global de maneira que consiga executar no console do Dom */
globalThis.setCardType = setCardType

//security-code

//pega elemeto do index.html a ser manipulado o input
const securityCode = document.querySelector("#security-code")
//cria um padrão da máscara
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//pega elemento de input de exepiração
const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
  //máscara
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      //pega os dois últos caracteres do ano atual
      from: String(new Date().getFullYear()).slice(2),
      //valida data do ano atual até 10 anos para frente e pega os dois últimos caracteres
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)

    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  upDateCardNumber(cardNumberMasked.value)
})

function upDateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  upDateExpirationDate(expirationDateMasked.value)
})

function upDateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
