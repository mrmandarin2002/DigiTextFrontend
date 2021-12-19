const MAX_BARCODE_LENGTH = 4

// whenever a barcode is scanned, it finds the type of barcode and calls the relevant functions
// scanner will also hold all the information regarding students, teachers, textbooks, and etc
// webpages will access the data through this class

class scanner {

    //essentially checks if keystrokes are from barcode
    checkBarcode(event){
        var current_time = new Date();
        current_time = current_time.getTime();
        //based on the very short delay between key presses of a barcode scanner
        if (current_time - this.last_scanned_time < 100 || !this.current_barcode){
            if(event.key === "Enter"){
                if(this.current_barcode.length >= MAX_BARCODE_LENGTH){
                    this.last_scanned_time = current_time;
                    this.barcodeScanned(this.current_barcode);
                    this.current_scanned_barcode = this.current_barcode
                } 
                this.current_barcode = "";
            } else {
                this.current_barcode += event.key;
            }
        }
        else{
            this.current_barcode = event.key
        }
        this.last_scanned_time = current_time;
    }

    constructor(api, controller){
        document.addEventListener("keypress", this.checkBarcode.bind(this));
        this.current_barcode = "";
        this.current_scanned_barcode = "";
        this.date = new Date();
        this.last_scanned_time = this.date.getTime();
        this.api = api
        this.controller = controller
    }

    barcodeScanned = (barcode) => {
        console.log("BARCODE SCANNED: " + this.current_barcode);
        this.controller.setState({
            currentBarcode : barcode
        })
        this.api.getTextbookInfo(barcode)
    }

}

export default scanner