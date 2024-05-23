#!/usr/bin/env python3
""" LFUCache module
"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LFUCache defines a LFU caching system
    """

    def __init__(self):
        """ Initialize
        """
        super().__init__()
        self.order = []
        self.frequency = {}

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.order.remove(key)
            self.frequency[key] += 1
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                lfu_keys = [k for k, v in self.frequency.items(
                ) if v == min(self.frequency.values())]
                if len(lfu_keys) > 1:
                    lfu_key = min(lfu_keys, key=lambda k: self.order.index(k))
                else:
                    lfu_key = lfu_keys[0]
                self.order.remove(lfu_key)
                del self.cache_data[lfu_key]
                del self.frequency[lfu_key]
                print(f"DISCARD: {lfu_key}")

            self.cache_data[key] = item
            self.frequency[key] = 1

        self.order.append(key)

    def get(self, key):
        """ Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None

        self.frequency[key] += 1
        self.order.remove(key)
        self.order.append(key)
        return self.cache_data[key]
