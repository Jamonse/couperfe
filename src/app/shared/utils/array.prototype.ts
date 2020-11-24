export { }

declare global
{
    interface Array<T>
    {
        pushSorted(element: T, compareFn);
    }
}

Array.prototype.pushSorted = function(element, compareFn)
{
    this.splice((arr => {
        let m = 0;
        let n = arr.length - 1;

        while(m <= n)
        {
            let k = (n + m) >> 1;
            let comparison = compareFn(element, arr[k]);

            if(comparison > 0)
            {
                m = k + 1;
            }
            else if(comparison < 0)
            {
                n = k - 1;
            }
            else
            {
                return k;
            }
        }

        return -m - 1;
    })(this), 0, element)
    return this.length;
};