def chunk_list(lst, chunk_size):
    print('chunk list: ', lst)
    for i in range(0, len(lst), chunk_size):
        yield lst[i : i + chunk_size]
