let nextUnitWork = null //待处理的一个fiber

//每次处理一个fiber并返回下一个待处理的fiber
function perforUnitOfWork(fiber) {
    //为当前fiber创建真实dom
    if(!fiber.dom){
        fiber.dom = createDom(fiber)
    }
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }
    //为当前fiber补充子代fiber
    const elements = fiber?.props?.children
    let prevSibling = null
    elements.forEach((childElement,index)=>{
        const newFiber = {
            parent: fiber,
            props: childElement.props,
            type: childElement.type,
            dom: null,
        }
        if(index===0) {
            fiber.child = newFiber
        }else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
    })
    //返回下一个任务单元
    if(fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while(nextFiber) {
        if(nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

//循环调用，浏览器空闲时就执行
function workLoop(deadline) {
    let shouldYield = true
    while(nextUnitWork && shouldYield) {
        nextUnitWork = perforUnitOfWork(nextUnitWork)
        shouldYield = deadline.timeRemaining() > 1
    }
    requestIdleCallback(workLoop)
}

//为fiber填充真实dom
function createDom(element){
    const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type)
    Object.keys(element?.props)
        .filter(prop => prop !== 'children')
        .forEach(key => dom[key] = element.props[key])
    element.props?.children?.forEach(child => render(child,dom))
    return dom
}

export default function render(element,container){
    nextUnitWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
    requestIdleCallback(workLoop)
}