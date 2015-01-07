

#include "reference_counter.h"

//Allocate a reference counted object
void *REFCOUNT_alloc(size_t size)
{
    ref_object_t *ref_object;

    //Allocate storage structure
    ref_object = (ref_object_t *)malloc(sizeof(ref_object_t));
    if (ref_object == NULL) {
        return NULL;
    }

    //Allocate data area
    ref_object->data = malloc(size);
    if (ref_object->data == NULL) {
        free(ref_object);
        return NULL;
    }

    return (void *)ref_object;
}

int REFCOUNT_up(void *data)
{
	//Reverse cast to reference object
    ref_object_t *ref_object = (ref_object_t *) data;

    //Increment counter
    ref_object->count ++;
}

//Free a reference counted object
int REFCOUNT_down(void *data)
{
	//Reverse cast to reference object
    ref_object_t *ref_object = (ref_object_t *) data;

    //Decrement counter
    ref_object->count --;

    if (ref_object->count > 0) {
    	//In use, return current count
    	return ref_object->count;
    }

    //All references complete, free
    free(ref_object->data);
    free(ref_object);

    return 0;
}

