

export class Scroll {

    constructor(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll, miniCanvas) {
        this.fullCanvas = fullCanvas;
        this.horizontalBar = horizontalBar;
        this.horizontalScroll = horizontalScroll;
        this.verticalBar = verticalBar;
        this.verticalScroll = verticalScroll;
        this.miniCanvas = miniCanvas;

        this.init();
        
        this.horizontallyScrolled = 0;
        this.verticallyScrolled = 0;

        this.totalContentWidth = 0;
        this.totalContentHeight = 0;

    }

    init() {
        this.updateHorizontalScrollBar();
        this.updateVerticalScrollBar();
        this.totalContentWidth = this.horizontalScroll.clientWidth * 2;
    }

    updateGrid() {
        this.miniCanvas.renderCanvasOnScroll(this.horizontallyScrolled, this.verticallyScrolled);
    }

    updateHorizontalScrollBar() {
        this.horizontalBar.addEventListener('pointerdown', (e) => {
            e.preventDefault();

            //To check if horizontal Scrolling
            let isHorizontalScrolling = true;

            // To get Starting position of mouse with respect to page
            let startMouseX = e.pageX;

            // To get position of horzontal bar from left
            let startBarLeft = this.horizontalBar.offsetLeft;



            const onMouseMove = (e) => {
                if (!isHorizontalScrolling) return;
                e.preventDefault();

                // To know the current value of Current mouse with respect to page
                let currentMouseX = e.pageX;

                // To know how much mouse have moved
                let diffX = currentMouseX - startMouseX;


                // To get new position of Bar from left
                let newBarLeft = startBarLeft + diffX;

                // how much the bar can move / travel
                let maxBarLeft = this.horizontalScroll.clientWidth - this.horizontalBar.offsetWidth;

                // Limiting the Bar , so that it can't go back the starting position and not not go beyond maxBarleft
                newBarLeft = Math.max(0, Math.min(newBarLeft, maxBarLeft));

                // Deciding how much content should be loaded 
                let minContentWidth = this.horizontalScroll.clientWidth * 2;

                console.log(newBarLeft)

                // how much u have scrolled till now with respect to content
                this.horizontallyScrolled = newBarLeft * this.totalContentWidth / this.horizontalScroll.clientWidth;

                // It is used for increasing more conentent , when we reach 80% of total content width , total content width get increases by horziontal Scroll clienWidth
                if (this.horizontallyScrolled >= .8 * (this.totalContentWidth - this.horizontalScroll.clientWidth)) {
                    this.totalContentWidth += this.horizontalScroll.clientWidth;
                }
                
                // This is used when horizontally scroll become less or equal to 0 , the total content Width become equal to minContent Width 
                else if (this.horizontallyScrolled <= 0) {
                    this.totalContentWidth = minContentWidth;
                }

                newBarLeft = this.horizontallyScrolled * this.horizontalScroll.clientWidth / this.totalContentWidth;

                this.horizontalBar.style.width = (this.horizontalScroll.clientWidth * this.horizontalScroll.clientWidth / this.totalContentWidth) + "px"

                // Update bar style
                this.horizontalBar.style.left = `${newBarLeft}px`;

                startMouseX = currentMouseX;
                startBarLeft = newBarLeft;

                this.updateGrid();
            };

            const onMouseUp = () => {
                isHorizontalScrolling = false;
                window.removeEventListener('pointermove', onMouseMove);
                window.removeEventListener('pointerup', onMouseUp);
            };

            window.addEventListener('pointermove', onMouseMove);
            window.addEventListener('pointerup', onMouseUp);
        });
    }


    updateVerticalScrollBar() {
        this.verticalBar.addEventListener('pointerdown', (e) => {
            e.preventDefault();

            let isVerticalScrolling = true;

            let startMouseY = e.pageY;

            let startBarTop = this.verticalBar.offsetTop;


            const onMouseMove = (e) => {
                if (!isVerticalScrolling) return;
                e.preventDefault();

                let currentMouseY = e.pageY;

                let diffY = currentMouseY - startMouseY;


                let newBarTop = startBarTop + diffY;

                let maxBarTop = this.verticalScroll.clientHeight - this.verticalBar.offsetHeight;
                newBarTop = Math.max(0, Math.min(newBarTop, maxBarTop));

                let minContentHeight = this.verticalScroll.clientHeight * 2;

                console.log(newBarTop)

                this.verticallyScrolled = newBarTop * this.totalContentHeight / this.verticalScroll.clientHeight;

                if (this.verticallyScrolled >= .8 * (this.totalContentHeight - this.verticalScroll.clientHeight)) {
                    this.totalContentHeight += this.verticalScroll.clientHeight;

                }
                else if (this.verticallyScrolled <= 0) {
                    this.totalContentHeight = minContentHeight;
                }

                newBarTop = this.verticallyScrolled * this.verticalScroll.clientHeight / this.totalContentHeight;

                this.verticalBar.style.height = (this.verticalScroll.clientHeight * this.verticalScroll.clientHeight / this.totalContentHeight) + "px"

                this.verticalBar.style.top = `${newBarTop}px`;

                startMouseY = currentMouseY;
                startBarTop = newBarTop;

                this.updateGrid();
            };

            const onMouseUp = () => {
                isVerticalScrolling = false;
                window.removeEventListener('pointermove', onMouseMove);
                window.removeEventListener('pointerup', onMouseUp);
            };

            window.addEventListener('pointermove', onMouseMove);
            window.addEventListener('pointerup', onMouseUp);
        });
    }

}