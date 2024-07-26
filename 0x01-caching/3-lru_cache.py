#!/usr/bin/python3
""" LRUCache module
"""
from base_caching import BaseCaching
from collections import OrderedDict


class LRUCache(BaseCaching):
    """
    LRUCache function
    """
    def __init__(self):
        """
        constructor of the func
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        put function
        """

        if key is None or item is None:
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            if key not in self.cache_data:
                key_discarded, _ = self.cache_data.popitem(True)
                print("DISCARD:", key_discarded)
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=False)

    def get(self, key):
        """
        get function
        """
        if key is None:
            return
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key)
