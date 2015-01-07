

#ifndef REFERENCE_COUNTER_H
#define REFERENCE_COUNTER_H

typedef struct ref_object_s {
	void* data;
	int count;
} ref_object_t;

//Allocate a reference counted object
extern void* REFCOUNT_alloc(size_t size);

//Increase reference count
extern int REFCOUNT_up(void *data);

//Free a reference counted object
extern int REFCOUNT_down(void* data);

#endif
