import { Button } from '../index.js'

function xx () {
  console.log('clicked')
}

function create_test_button () {
  let button = new Button({label:'Test',onClick: xx })
  console.log(button.button)
  $('#test')[0].append(button.button[0])
}

export default create_test_button