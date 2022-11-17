class Tasker {
    jobs;
    connection;
    isProcessing;
    interactionType;
    errorCB;

    constructor(connection, interactionType, errorCB) {
        this.jobs = [];
        this.connection = connection;
        this.isProcessing = false;
        this.errorCB = errorCB;
        this.interactionType = interactionType;
        
    }

    scheduleTask(data) {
        this.jobs.push(data);
        if(!this.isProcessing) {
            this.executeTask(this.jobs[0])
        }
    }

    executeTask({ type, name, props }) {
        this.isProcessing = true;
        this.jobs.shift();

        const timeout = setTimeout( () => {
            if(this.interactionType && this.interactionType[type]) {
                this.interactionType[type]({type, name, props});
            } else {
                this.error(`Widget "${type}" not found in library`);
            }

            this.isProcessing = false;

            if(this.jobs.length > 0) {
                this.executeTask(this.jobs[0]);
            } 
            clearTimeout(timeout);
        }, props.delay ? props.delay * 1000 : 0);
    }

    error(msg) {
        console.error(msg);
        if(this.errorCB) {
            this.errorCB(msg);
        }
    }
}

export {
    Tasker
}