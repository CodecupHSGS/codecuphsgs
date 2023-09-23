export default class BlockingQueue { 
    /**
     * The interface of this class follow the implementation
     * of blocking queue in Java
     * Right now it does not support max element
     *  */ 

    #elements = []; 
    #head_index = 0; 
    #maxElement = null; 
    
    #blocks = []; 
    #head_block_index = 0; 

    /* 
    constructor(maxElement){ 
        if(maxElement) {
            this.#maxElement = maxElement; 
        }
    }
    */

    constructor() { 

    }

    add(e) { 
        this.#add(e); 
    }

    remove() {
        return this.#removeHead(); 
    }

    /**
     * Retrieve, but not remove the head of the queue. If 
     * the queue is empty, throw a new error. 
     */
    element() { 
        return this.#getHead(); 
    }

    put(e) { 
        this.#add(e); // temporarily, maxElement option is not supported
    }

    async take() { 
        return await this.#take(); 
    }

    async #take() { 
        await new Promise((resolve) => { 
            this.#addBlock({
                free: () => { 
                    resolve(); 
                }
            })
        }); 

        return this.#removeHead(); 
    }

    // return the head. throw error if emtpy
    #getHead() { 
        this.#throwIfEmpty(); 
        return this.#elements[this.#head_index]; 
    }

    // remove the head and return it. throw error if empty
    #removeHead() { 
        const e = this.#getHead(); 
        this.#head_index++; 
        return e; 
    }

    // push an element to the back. 
    #add(e) { 
        this.#throwIfOutOfSpace(); 
        this.#elements.push(e); 
        this.#freeHeadBlockIfAvailable(); 
    }

    // throw error if empty
    #throwIfEmpty() { 
        if(this.#isEmpty()) { 
            throw new Error("Queue is empty"); 
        }
    }

    #throwIfOutOfSpace() {
        if(this.#outOfSpace()) { 
            throw new Error("Queue is out of space"); 
        }
    }

    #outOfSpace() { 
        if(this.#maxElement) {
            return this.#size() >= this.#maxElement; 
        }
        else { 
            return false; 
        }
    }

    // return true if the queue is empty
    #isEmpty() { 
        return this.#head_index >= this.#elements.length; 
    }

    #size() { 
        return this.#elements.length - this.#head_index; 
    }

    // BLOCK MANAGEMENT
    #hasNoBlock() { 
        return this.#head_block_index >= this.#blocks.length; 
    }

    #freeHeadBlock() { 
        if(this.#hasNoBlock) { 
            throw new Error("Implementation Error: has no block but trying to free"); 
        }
        this.#blocks[this.#head_block_index].free(); 
        this.#head_block_index++; 
    }

    #freeHeadBlockIfAvailable() { 
        if(this.#hasNoBlock == false)  { 
            this.#freeHeadBlock(); 
        }
    }

    #addBlock(block) { 
        // if there is at least one element, resolve the block immediately. 
        if(this.#isEmpty() == false) {
            block.free(); 
        }
        // otherwise, push the block into queue. 
        else {
            this.#blocks.push(block); 
        }
    }
}