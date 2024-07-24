

export let horizontallyScrolled = 0;

export class Scroll {

    constructor(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll, miniCanvas) {
        this.fullCanvas = fullCanvas;
        this.horizontalBar = horizontalBar;
        this.horizontalScroll = horizontalScroll;
        this.verticalBar = verticalBar;
        this.verticalScroll = verticalScroll;
        this.miniCanvas = miniCanvas;
        this.init();
        this.prevScrolledHorizontal = 0;

    }

    init() {
        this.updateHorizontalScrollBar();
        this.updateVerticalScrollBar();
    }

    updateGrid() {
        this.miniCanvas.renderCanvasOnScroll();
    }

    updateHorizontalScrollBar() {

        this.horizontalBar.addEventListener('mousedown', (e) => {
            e.preventDefault();

            let isHorizontalScrolling = true;
            let startMouseX = e.clientX;
            let startBarLeft = this.horizontalBar.offsetLeft;

            const onMouseMove = (e) => {
                e.preventDefault();
                if (isHorizontalScrolling) {
                    const currentMouseX = e.clientX;
                    let diffX = currentMouseX - startMouseX;
                    let newLeft = startBarLeft + diffX;
                    let maxBarLeft = this.horizontalScroll.clientWidth - this.horizontalBar.offsetWidth;
                    horizontallyScrolled = this.prevScrolledHorizontal + diffX;

                    // console.log(horizontallyScrolled)

                    if (newLeft < 0) {
                        newLeft = 0;
                        this.horizontalBar.style.width = 0.80 * this.horizontalScroll.clientWidth + 'px';
                        horizontallyScrolled = 0;
                        //making the scrollbar of original size on reaching the start again
                    }


                    if (newLeft > maxBarLeft) {
                        newLeft = maxBarLeft;

                        //setting width as per scrolled
                        this.horizontalBar.style.width = `${this.horizontalScroll.clientWidth / horizontallyScrolled * 100}px`;
                        this.horizontalBar.style.left = `${newLeft / 2}px`;
                        startBarLeft = newLeft / 2;
                        startMouseX = e.clientX;
                        this.prevScrolledHorizontal = horizontallyScrolled;
                    }
                    else {
                        this.horizontalBar.style.left = `${newLeft}px`
                    }


                    if (diffX < 0 && newLeft > 0 && this.prevScrolledHorizontal >= 0) {
                        //backward
                        let ratio = (horizontallyScrolled / newLeft) * (-diffX);
                        horizontallyScrolled = horizontallyScrolled - ratio;
                        this.prevScrolledHorizontal -= ratio;
                        // console.log(horizontallyScrolled, newLeft, ratio)
                    }

                    this.updateGrid();
                }

            };

            const onMouseUp = (e) => {
                isHorizontalScrolling = false;
                this.prevScrolledHorizontal = horizontallyScrolled;
                this.fullCanvas.removeEventListener('mousemove', onMouseMove);
                this.fullCanvas.removeEventListener('mouseup', onMouseUp);
                this.fullCanvas.removeEventListener('mouseleave', onMouseUp)
            };

            this.fullCanvas.addEventListener('mousemove', onMouseMove);
            this.fullCanvas.addEventListener('mouseup', onMouseUp);
            this.fullCanvas.addEventListener('mouseleave', onMouseUp);
        });

    }

    // updateHorizontalScrollBar(){

    // }

    updateVerticalScrollBar() {

        this.verticalBar.addEventListener('mousedown', (e) => {
            e.preventDefault();

            let isVerticalScrolling = true;
            let startMouseY = e.clientY;
            let startBarTop = this.verticalBar.offsetTop;
            let prevBarHeight = this.verticalBar.offsetHeight;

            const onMouseMove = (e) => {
                if (isVerticalScrolling) {
                    const currentMouseY = e.clientY;
                    const diffY = currentMouseY - startMouseY;
                    let newTop = startBarTop + diffY;
                    let maxBarTop = this.verticalScroll.clientHeight - this.verticalBar.offsetHeight;

                    newTop < 0 ? newTop = 0 : "";

                    if (newTop > maxBarTop) {
                        newTop = maxBarTop;
                        this.verticalBar.style.height = `${prevBarHeight * 0.7}px`;
                        this.verticalBar.style.top = `${newTop / 2}px`;
                        startBarTop = newTop / 2;
                        startMouseY = e.clientY;
                        prevBarHeight = prevBarHeight * 0.7;
                    }

                    this.verticalBar.style.top = `${newTop}px`

                }
            };

            const onMouseUp = (e) => {
                isVerticalScrolling = false;
                this.fullCanvas.removeEventListener('mousemove', onMouseMove);
                this.fullCanvas.removeEventListener('mouseup', onMouseUp);
                this.fullCanvas.removeEventListener('mouseleave', onMouseUp);
            };

            this.fullCanvas.addEventListener('mousemove', onMouseMove);
            this.fullCanvas.addEventListener('mouseup', onMouseUp);
            this.fullCanvas.addEventListener('mouseleave', onMouseUp)
        });


    }

}
