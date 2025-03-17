let urlParts = window.location.href.split("/")
let urlEnd = urlParts[urlParts.length - 1]
var thisPage = urlEnd.split("?")[0]
var targets = []
var urlVarNames = []
var urlVarValues = []
var urlVarsRaw = window.location.href.split("?")[1].split("&")

for(let i = 0; i < urlVarsRaw.length; i++) {
  [ urlVarNames[i], urlVarValues[i] ] = urlVarsRaw[i].split("=")
}

let targetNew = ''
let prefix = "target"
let prefixNew = "target-new"
let protocol = "http"
for(let i = 0; i < urlVarNames.length; i++) {
  let urlVarNameDecoded = decodeURIComponent(urlVarNames[i])
  if( prefix == urlVarNameDecoded.substring(0, prefix.length) ) {
    let target = decodeURIComponent(urlVarValues[i])
    if( protocol != target.substring(0, protocol.length) ) {
      target = "http://" + target
    } 
    if( prefixNew == decodeURIComponent(urlVarNames[i]).substring(0, prefixNew.length) ) {
      targetNew = target
    } else {
      targets.push(target)
    }
  }
}
if('' != targetNew) {
  targets.push(targetNew)
}

document.addEventListener("DOMContentLoaded", buildPage)


function buildPage() {
  fixTargetForm()
  addTableOfFrames()
}


function fixTargetForm() {
  let targetForm = document.getElementById("target-form")
  targetForm.setAttribute("action", thisPage)
  for(let i = 0; i < targets.length; i++) {
    let target = targets[i]
    let input = addElement(targetForm, "input")
    input.setAttribute("type", "hidden")
    input.setAttribute("name", "target" + i)
    input.setAttribute("value", targets[i])
  }
}


function addTableOfFrames() {
  let table = document.getElementById("table-of-frames")
  let tbody = table.getElementsByTagName("tbody")[0]
  for(let i = 0; i < targets.length; i++) {
    addEntryToTableOfFrames(tbody, i)
  }
}


function addEntryToTableOfFrames(tbody, i) {
  let target = targets[i]
  // empty space
  let rowEmpty = tbody.insertRow(-1)
  let cellEmpty = rowEmpty.insertCell(-1)
  let textEmpty = addText(cellEmpty, "")
  // button row (remove, link)
  let rowButtons = tbody.insertRow(-1)
  // remove form and remove button
  let cellRemove = rowButtons.insertCell(-1)
  let formRemove = addElement(cellRemove, "form")
  formRemove.setAttribute("action", thisPage)
  formRemove.setAttribute("method", "GET")
  for(let ii = 0; ii < targets.length; ii++) {
    if( i != ii ) {
      let inputHidden = addElement(formRemove, "input")
      inputHidden.setAttribute("type", "hidden")
      inputHidden.setAttribute("name", "target" + ii)
      inputHidden.setAttribute("value", targets[ii])
    }
  }
  let inputRemove = addElement(formRemove, "input")
  inputRemove.setAttribute("type", "submit")
  inputRemove.setAttribute("value", "remove")
  // link
  let cellLink = rowButtons.insertCell(-1)
  let div = addElement(cellLink, "div")
  div.setAttribute("float", "right")
  let link = addElement(div, "a")
  link.setAttribute("href", target)
  let textLink = addText(link, "link")
  let rowFrame = tbody.insertRow(-1)
  let cellFrame = rowFrame.insertCell(-1)
  // frame
  let iframe = addElement(cellFrame, "iframe")
  iframe.setAttribute("src", target)
}


function addText(parentElement, text) {
  return parentElement.appendChild(
    document.createTextNode(text)
  )
}


function addElement(parentElement, childElementName) {
  return parentElement.appendChild(
    document.createElement(childElementName)
  )
}
