#!/usr/bin/python3
""" LIFOCache module
"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFOCache function
    """
    def __init__(self):
        """
        constructor of the func
        """
        super().__init__()

    def put(self, key, item):
        """
        put function
        """

        if key is None or item is None:
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            if key not in self.cache_data:
                key_discarded = list(self.cache_data.keys())[-1]
                print("DISCARD:", key_discarded)
                del self.cache_data[key_discarded]
        self.cache_data[key] = item

    def get(self, key):
        """
        get function
        """
        if key is None:
            return
        return self.cache_data.get(key)
