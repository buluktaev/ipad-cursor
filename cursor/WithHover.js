import { useState, useContext, useEffect } from 'react';
import CursorContext from './CursorContext';

import { getRelativePosition } from './utils';

export default (Component, type) => ({passThroughRef, ...props}) => {
    const context = useContext(CursorContext);
    const { currentElement, pos, elementType } = context;
    const [ hovering, setHovering ] = useState(false);

    const handleMouseEnter = e => {
        context.setCurrentElement(e.target, type);
        setHovering(true);
    }
    const handleMouseLeave = ({pageX, pageY, ...e}) => {
        context.removeCurrentElement()
        setHovering(false);
    }

    let baseStyles;
    if (hovering) {
        const amount = 2;
        const relativePos = getRelativePosition(pos, currentElement);
        const xMid = currentElement.clientWidth / 2;
        const yMid = currentElement.clientHeight / 2;
        const xMove = (relativePos.x - xMid) / currentElement.clientWidth * amount;
        const yMove = (relativePos.y - yMid) / currentElement.clientHeight * amount;

        if (elementType == "block" && xMove < 200 && yMove < 200) {
            baseStyles = {
                transform: `translate(${xMove}px, ${yMove}px) scale(1.1)`,
            }
        }
    }

    return <Component
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={baseStyles}
        ref={passThroughRef}
        {...props}
    />
}