#!/usr/bin/python3
""" LFUCache module
"""
from base_caching import BaseCaching
from collections import OrderedDict


class LFUCache(BaseCaching):
    """
    LFUCache function
    """
    def __init__(self):
        """
        constructor of the func
        """
        super().__init__()
        self.cache_data = OrderedDict()
        self.key_freq = {}

    def put(self, key, item):
        """
        put function
        """

        if key is None or item is None:
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            if key not in self.cache_data:
                key_discarded = min(iter(self.key_freq.keys()),
                                    key=lambda k: self.key_freq[k])
                print("DISCARD:", key_discarded)
                del self.cache_data[key_discarded]
                del self.key_freq[key_discarded]
        self.cache_data[key] = item
        if key in self.key_freq:
            self.key_freq[key] += 1
        else:
            self.key_freq[key] = 1

    def get(self, key):
        """
        get function
        """
        if key is None or key not in self.cache_data:
            return
        self.key_freq[key] += 1
        return self.cache_data.get(key)
