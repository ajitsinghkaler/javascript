An array is not a primary data type in javascript. So, today I thought can I implement my own javascript class that can implement an array. So, I tried it and I'm pretty happy with the results. You can see my whole implementation on [github](https://github.com/ajitsinghkaler/javascript/blob/master/interview/array.js).

The following were the API functions that I implemented:

size() - returns length

is_empty() - checks if array is empty

at(index) - returns the item at the given index, returns undefined if something is out of bound

push(item) = push an element at the end returns array

insert(index, item) - inserts an item at index, shifts that index's value and trailing elements to the right returns an array

prepend(item) - insert an element at index 0 returns array

pop() - remove from end, return element

delete(index) - delete item at index, shifting all trailing elements left, return element.

removeAll(item) - looks for value and removes index holding it (even if in multiple places) returns a new array

deleteAll(item) - looks for value and removes index holding it (even if in multiple places) returns the new array

find(item) - looks for value and returns the first index with that value, -1 if not found

> Let me know if you know any better implementations.