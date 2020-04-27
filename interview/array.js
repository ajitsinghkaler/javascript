class Arr {
    length = 0;
    data = {};
    constructor(...args) {
        this.length = args.length;
        for (const key in args) {
            this.data[key] = args[key];
        }
    }

    size() {
        return this.length;
    }

    isEmpty() {
        return this.length === 0;
    }

    at(index) {
        return this.data[index];
    }

    push(item) {
        this.data[this.length] = item;
        this.length++;
        return this.length;
    }

    pop() {
        delete this.data[this.length - 1]
        this.length--;
        return this.data;
    }

    insert(index, item) {
        for (let i = this.length; i >= index; i--) {
            this.data[i] = this.data[i - 1];
        }
        this.data[index] = item;
        this.length++;
        return this.data;
    }

    prepend(item) {
        return this.insert(0, item);
    }

    delete(index) {
        for (let i = index; i < this.length - 1; i++) {
            this.data[i] = this.data[i + 1];
        }
        delete this.data[this.length - 1];
        this.length--;
        return this.data;
    }

    deleteAll(item) {
        const temp = Object.values(this.data).filter(value=> value!==item)
        this.data = {}

        for (const key in temp) {
            this.data[key] = temp[key];
        }
        this.length = temp.length;
        return this.data;
    }

    removeAll(item) {
        let index = 0;
        for(const key in this.data){
            if(this.data[key]===item) continue;
            this.data[index] = this.data[key]
            index++;
        }
        for(let i = index; i<this.length;i++){
            delete this.data[i]
        }
        this.length = index;
        return this.data;
    }

    find(item) {
        for (const key in this.data) {
            if (this.data[key] === item) return key;
        }

        return -1;
    }
}