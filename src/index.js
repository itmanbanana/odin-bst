class Node {
    _value;
    _leftChild;
    _rightChild;
    constructor(v, lc = undefined, rc = undefined) {
        this._value = v;
        this._leftChild = lc;
        this._rightChild = rc;
    }
    get value() { return this._value; }
    get leftChild() { return this._leftChild; }
    get rightChild() { return this._rightChild; }
    set value(v) { this._value = v; }
    set leftChild(lc) { this._leftChild = lc; }
    set rightChild(lc) { this._rightChild = lc; }
}
class Tree {
    _root;
    constructor(arr) {
        this._root = this.buildTree(arr);
    }
    get root() { return this._root; }
    set root(r) { this._root = r; }
    buildTree(arr) {
        if (arr.length === 0)
            return undefined;
        arr.sort((a, b) => a - b);
        arr = this.removeDuplicates(arr);
        const bstRecur = (arr, start, end) => {
            if (start > end)
                return undefined;
            const mid = start + Math.floor((end - start) / 2);
            const parent = new Node(arr[mid]);
            parent._leftChild = bstRecur(arr, start, mid - 1);
            parent._rightChild = bstRecur(arr, mid + 1, end);
            return parent;
        };
        return bstRecur(arr, 0, arr.length - 1);
    }
    prettyPrint(node, prefix = '', isLeft = true) {
        if (node === null || node === undefined) {
            return;
        }
        this.prettyPrint(node.rightChild, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
        this.prettyPrint(node.leftChild, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
    removeDuplicates(arr) {
        const newArr = [];
        if (arr[0])
            newArr.push(arr[0]);
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] !== arr[i - 1])
                newArr.push(arr[i]);
        }
        return newArr;
    }
    includes(v) {
        let node = this._root;
        while (node) {
            if (node.value === v)
                return true;
            else if (node.value > v)
                node = node?._leftChild;
            else
                node = node?.rightChild;
        }
        return false;
    }
    insertNode(v) {
        const newNode = new Node(v);
        let r = this.root;
        if (this.includes(v))
            return;
        if (!r)
            return newNode;
        while (r) {
            if (v > r.value && r.rightChild)
                r = r.rightChild;
            else if (v < r.value && r.leftChild)
                r = r.leftChild;
            else
                break;
        }
        if (v > r.value)
            r.rightChild = newNode;
        else
            r.leftChild = newNode;
        return r;
    }
    deleteNode(v) {
        let node = this.root;
        let parent = this.root;
        let fromLeft = false;
        while (node) {
            if (node.value === v) {
                const nodeLeft = node.leftChild;
                const nodeRight = node.rightChild;
                if (!nodeLeft && !nodeRight) {
                    // leaf node - remove from parent
                    if (parent) {
                        if (fromLeft)
                            parent.leftChild = undefined;
                        else
                            parent.rightChild = undefined;
                    }
                }
                else if (nodeLeft && !nodeRight) {
                    // node has one child on the left
                    if (parent) {
                        if (fromLeft)
                            parent.leftChild = node.leftChild;
                        else
                            parent.rightChild = node.leftChild;
                    }
                }
                else if (!nodeLeft && nodeRight) {
                    // node has one child on the right
                    if (parent) {
                        if (fromLeft)
                            parent.leftChild = node.rightChild;
                        else
                            parent.rightChild = node.rightChild;
                    }
                }
                else {
                    // node has two children on left and right
                    // 1. find left-most node on right subtree
                    let leftMost = node.rightChild;
                    let leftMostParent = node;
                    while (true) {
                        if (leftMost?.leftChild) {
                            leftMostParent = leftMost;
                            leftMost = leftMost.leftChild;
                        }
                        else
                            break;
                    }
                    // 2. get value from left-most node and delete it
                    const leftMostValue = leftMost.value;
                    // check if parent is equal to node itself, as the
                    // leftMost would be its direct right child, otherwise
                    // its it's left child
                    if (node.rightChild?.value && leftMostParent.value === node.value) {
                        if (leftMost.rightChild)
                            leftMostParent.rightChild = leftMost.rightChild;
                        else
                            leftMostParent.rightChild = undefined;
                    }
                    else {
                        if (leftMost.rightChild)
                            leftMostParent.leftChild = leftMost.rightChild;
                        else
                            leftMostParent.leftChild = undefined;
                    }
                    // 3. set node's value to leftMostValue
                    node.value = leftMostValue;
                }
                break;
            }
            else if (node.value > v) {
                parent = node;
                node = node.leftChild;
                fromLeft = true;
            }
            else {
                parent = node;
                node = node.rightChild;
                fromLeft = false;
            }
        }
    }
    levelOrderForEach(callback) {
        if (callback === undefined)
            throw new Error("levelOrderForEach requires callback function");
        const q = [];
        q.push(this.root);
        while (q.length) {
            const node = q.shift();
            callback(node.value);
            if (node?.leftChild)
                q.push(node.leftChild);
            if (node?.rightChild)
                q.push(node.rightChild);
        }
    }
    inOrderForEach(callback) {
        if (callback === undefined)
            throw new Error("inOrderForEach requires callback function");
        const q = [];
        const inOrder = (node) => {
            if (node.leftChild)
                inOrder(node.leftChild);
            q.push(node);
            if (node.rightChild)
                inOrder(node.rightChild);
        };
        inOrder(this.root);
        while (q.length)
            callback(q.shift().value);
    }
    preOrderForEach(callback) {
        if (callback === undefined)
            throw new Error("preOrderForEach requires callback function");
        const q = [];
        const preOrder = (node) => {
            q.push(node);
            if (node.leftChild)
                preOrder(node.leftChild);
            if (node.rightChild)
                preOrder(node.rightChild);
        };
        preOrder(this.root);
        while (q.length)
            callback(q.shift().value);
    }
    postOrderForEach(callback) {
        if (callback === undefined)
            throw new Error("postOrderForEach requires callback function");
        const q = [];
        const postOrder = (node) => {
            if (node.leftChild)
                postOrder(node.leftChild);
            if (node.rightChild)
                postOrder(node.rightChild);
            q.push(node);
        };
        postOrder(this.root);
        while (q.length)
            callback(q.shift().value);
    }
    height(v) {
        if (!this.includes(v))
            return -1;
        let node = this.root;
        const depthRelative = (d, n) => {
            if (!n)
                return d;
            return Math.max(depthRelative(d + 1, n.leftChild), depthRelative(d + 1, n.rightChild));
        };
        while (node) {
            if (v === node.value) {
                return depthRelative(-1, node);
            }
            else if (v > node.value)
                node = node.rightChild;
            else
                node = node.leftChild;
        }
        return -1;
    }
    depth(v) {
        if (!this.includes(v))
            return undefined;
        let depth = 0;
        const depthRecur = (node) => {
            if (v === node.value)
                return;
            else if (v > node.value) {
                depth++;
                depthRecur(node.rightChild);
            }
            else {
                depth++;
                depthRecur(node.leftChild);
            }
        };
        depthRecur(this.root);
        return depth;
    }
    isBalanced() {
        const checkBalance = (node) => {
            if (!node)
                return true;
            const leftHeight = (node.leftChild !== undefined) ? this.height(node.leftChild.value) : 0;
            const rightHeight = (node.rightChild !== undefined) ? this.height(node.rightChild.value) : 0;
            if (Math.abs(leftHeight - rightHeight) > 1)
                return false;
            return (checkBalance(node.leftChild) && checkBalance(node.rightChild));
        };
        return checkBalance(this.root);
    }
    rebalance() {
        const sortedArr = [];
        const pushToSortedArr = (n) => { sortedArr.push(n); };
        this.inOrderForEach(pushToSortedArr);
        this._root = this.buildTree(sortedArr);
        this.prettyPrint(this._root);
    }
}
const myTree = new Tree([1, 7, 4, 3, 5, 7, 9, 67, 66, 324]);
console.log(myTree.prettyPrint(myTree.root));
console.log(myTree.isBalanced());
myTree.insertNode(325);
myTree.insertNode(326);
console.log(myTree.prettyPrint(myTree.root));
console.log(myTree.isBalanced());
myTree.rebalance();
console.log(myTree.isBalanced());
export {};
//# sourceMappingURL=index.js.map