import MyReact from './mreact/index.js'

const element = MyReact.createElement(
    'div',
    {class: 'div'},
    MyReact.createElement('h2',null,'h2'),
    MyReact.createElement('h1',null,'h1')
)

MyReact.render(element,document.getElementById('app'))
