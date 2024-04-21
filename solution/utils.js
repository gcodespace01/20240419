module.exports =
class Utils {
    sort(array) {
        array.sort((a, b) => {
            return a.date - b.date
        })
    }

    insert(item, array) {
        let left = 0;
        let right = array.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (array[mid].date === item.date) {
                // If dates are equal, insert the new item after the existing one
                array.splice(mid + 1, 0, item);
                return;
            } else if (array[mid].date < item.date) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        // If the loop exits, 'left' will point to the correct position to insert the item
        array.splice(left, 0, item);
    }
}
