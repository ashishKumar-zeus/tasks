

export class Scroll {

    constructor(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll, miniCanvas) {
        this.fullCanvas = fullCanvas;
        this.horizontalBar = horizontalBar;
        this.horizontalScroll = horizontalScroll;
        this.verticalBar = verticalBar;
        this.verticalScroll = verticalScroll;
        this.miniCanvas = miniCanvas;

        
        this.horizontallyScrolled = 0;
        this.verticallyScrolled = 0;

        this.totalContentWidth = 0;
        this.totalContentHeight = 0;

        this.wheelScrollRate = 10;
        this.init();


    }

    init() {
        this.updateHorizontalScrollBar();
        this.updateVerticalScrollBar();
        this.totalContentWidth = this.horizontalScroll.clientWidth * 2;
        this.totalContentHeight = this.verticalScroll.clientHeight * 2;

    }

    updateGrid() {
        this.miniCanvas.renderCanvasOnScroll(this.horizontallyScrolled, this.verticallyScrolled);
    }

    updateHorizontalScrollBar() {

        let isHorizontalScrolling = false;
        let startMouseX = 0;
        let startBarLeft = 0;

        this.horizontalBar.addEventListener('pointerdown', (e) => {
            e.preventDefault();

            //To check if horizontal Scrolling
            isHorizontalScrolling = true;

            // To get Starting position of mouse with respect to page
            startMouseX = e.pageX;

            // To get position of horzontal bar from left
            startBarLeft = this.horizontalBar.offsetLeft;



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

        let isVerticalScrolling = false;
        let startMouseY = 0;
        let startBarTop = this.verticalBar.offsetTop;
        let currentMouseY = 0;

        //fucntion to update the scroll bar and content using the diff
        const updateScrollByDiff=(diffY)=>{

            let newBarTop = startBarTop + diffY;

            let maxBarTop = this.verticalScroll.clientHeight - this.verticalBar.offsetHeight;
            newBarTop = Math.max(0, Math.min(newBarTop, maxBarTop));

            let minContentHeight = this.verticalScroll.clientHeight * 2;

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

            currentMouseY = 0;

            this.updateGrid();
        }
    
        this.verticalBar.addEventListener('pointerdown', (e) => {
            e.preventDefault();

            isVerticalScrolling = true;
            startMouseY = e.pageY;
            startBarTop = this.verticalBar.offsetTop;

            const onMouseMove = (e) => {
                if (!isVerticalScrolling) return;
                e.preventDefault();
                currentMouseY = e.pageY;
                let diffY = currentMouseY - startMouseY;
                updateScrollByDiff(diffY);
            };

            const onMouseUp = () => {
                isVerticalScrolling = false;
                window.removeEventListener('pointermove', onMouseMove);
                window.removeEventListener('pointerup', onMouseUp);
            };

            window.addEventListener('pointermove', onMouseMove);
            window.addEventListener('pointerup', onMouseUp);
            
        });
        
        this.fullCanvas.addEventListener('wheel',(e)=>{
            e.preventDefault();
            updateScrollByDiff(e.deltaY * this.wheelScrollRate / 100)
        })
    }

}