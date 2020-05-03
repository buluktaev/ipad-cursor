import { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import CursorContext from './CursorContext';
import { getRelativePosition } from '../utils';


const Dot = styled.div`
    position: absolute;
    pointer-events: none;
    transform-origin: 50% 50%;
    transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
`;

const Block = styled.div`
    width: 32px;
    height: 32px;
    position: absolute;
    background: #555;
    border-radius: 4px;
    pointer-events: none;
    transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
    /* transform: scale(0); */
`;

const Cursor = () => {
    // const [ transitioning, setTransitioning ] = useState(false);
    const context = useContext(CursorContext);
    const { pos, currentElement, transitionEnter, transitionExit, speed, exitOrigin } = context;
    const [ previousTween, setPreviousTween ] = useState();
    const [ hovering, setHovering ] = useState(false);
    const blockRef = useRef();
    const dotRef = useRef();
    let wiggle = {x: 0, y: 0};

    let blockStyles = {
        borderRadius: '50%'
    };
    let dotStyles;
    
    let d = speed;
    
    useEffect(() => {
        const block = blockRef.current;
        const dot = dotRef.current;
        
        let fadeDot;
        let snapToElement;

        if (currentElement) {
            const relativePos = getRelativePosition(pos, currentElement);
            const xMid = currentElement.clientWidth / 2;
            const yMid = currentElement.clientHeight / 2;

            snapToElement = gsap.to(block, {
                duration: .5,
                ease: "elastic.out(1, .5)",
                left: currentElement.offsetLeft,
                top: currentElement.offsetTop,
                height: currentElement.offsetHeight + "px",
                width: currentElement.offsetWidth + "px",
                borderRadius: "4px",
                opacity: 1,
                paused: true,
                onComplete: () => setHovering(true)
            });
            fadeDot = gsap.to(dot, {
                duration: .5,
                ease: "elastic.out(1, .5)",
                left: currentElement.offsetLeft + xMid - 16 + "px",
                top: currentElement.offsetTop + yMid - 16 + "px",
                opacity: 0,
                paused: true,
            });

            if (currentElement && transitionEnter) {
                snapToElement.play(); 
                fadeDot.play();
                // setPreviousTween(snapToElement);
            }

        } else {
            if (previousTween) {
                // previousTween.reverse();
                // console.log("Here")
                gsap.set(dot, {clearProps: "all"});
                gsap.set(block, {clearProps: "all"});
            }
            // let snapBack = gsap.to(block, {
            //     duration: .5,
            //     ease: "elastic.out(1, .5)",
            //     opacity: 0,
            //     clearProps: "left, top, height, width",
            //     paused: true,
            //     onComplete: () => setHovering(true)
            // });
            // let fadeDotBack = gsap.to(dot, {
            //     duration: .3,
            //     clearProps: "transform, opacity",
            //     // opacity: 1,
            //     paused: true,
            // });
            // snapBack.play(); 
            // fadeDotBack.play();
        }
    }, [currentElement]);

    if (hovering && currentElement) {
        const amount = 10;
        const relativePos = getRelativePosition(pos, currentElement);
        const xMid = currentElement.clientWidth / 2;
        const yMid = currentElement.clientHeight / 2;
        const xMove = (relativePos.x - xMid) / currentElement.clientWidth * amount;
        const yMove = (relativePos.y - yMid) / currentElement.clientHeight * amount;
        wiggle = {
            x: xMove, 
            y: yMove
        }

        blockStyles = {
            left: currentElement.offsetLeft + wiggle.x,
            top: currentElement.offsetTop + wiggle.y,
            height: currentElement.offsetHeight + "px",
            width: currentElement.offsetWidth + "px",
            transition: `transform ${d}s, left ${d}s, top ${d}s, width: ${d}s, height ${d}s`,
            borderRadius: '4px'
        }
        dotStyles = {
            // opacity: 0
        }
    }

    return (
        <div>
            <Block ref={blockRef} style={{
                left: pos.x - 12,
                top: pos.y - 12,
                opacity: 0,
                ...blockStyles,
            }}>
            </Block>
            <Dot ref={dotRef} style={{
                left: pos.x - 12,
                top: pos.y - 12,
                ...dotStyles,
            }}>
                <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#555"/>
                    <rect x="120" width="100" height="100" rx="15" />
                </svg>
            </Dot>
        </div>
    )
}

export default Cursor;