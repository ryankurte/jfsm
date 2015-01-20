/**
 * Static Event Queue for use with JFSM C implementations
 * Provides a ring buffer based queue for event input and output
 * Wow this would be easier in a memory managed language with powerful primitives
 */

#ifndef STATIC_EVENT_QUEUE_H
#define STATIC_EVENT_QUEUE_H

/**
 * @brief Static event queue storage structure
 * @details Provides storage of events and associated data structures for use with
 * state machine modules.
 *
 */
typedef struct static_event_queue_s {
    int size;           //!< Size of event queue
    int head;           //!< Current queue head
    int tail;           //!< Current queue tail
    int count;          //!< Number of events in the queue
    int events[i];      //!< Event storage
    void *data[i];      //!< Associated data storage
} static_event_queue_t;

//Initialize a static event queue of the given size
extern int SEQ_init(static_event_queue_t *queue, int size);

//Put an event and associated data pointer into an event queue
extern int SEQ_put(static_event_queue_t *queue, int event, void *data);

//Pop an event and associated data pointer from the event queue
extern int SEQ_pop(static_event_queue_t *queue, int *event, void *data);

//Close a static event queue
extern int SEQ_close(static_event_queue_t *queue);

#endif
