# Race Conditions

## What are race conditions?

A race condition happens when a program's result depends on the order of events that are not fully controlled, it usually appears when two or more threads access the same shared data at the same time, and at at least one of them changes it.

### Example:
```py
def pay_person(giver, receiver, amount):
    giver_balance = get_balance(giver)

    if giver_balance < amount:
        return False

    receiver_balance = get_balance(receiver)
    set_balance(receiver, receiver_balance + amount)
    set_balance(giver, giver_balance - amount)

    return True
```

### Whats the issue with that code?

Imagine that `pay_person()` is called twice at nearly the exact same time.

For example, the giver has $100 but two payments of $80 are made at the same time

Both calls will run:
```py
giver_balance = get_balance(giver)
```

Both calls will see:
```py
giver_balance = 100
```

Hence, both calls will pass this check:
```py
if giver_balance < amount:
```
This will cause both payments to go through, giving the receiver $160 when the giver only has $100, creating $60 from thin air

## Examples of exploits
- [DemocracyCraft Realty](https://github.com/MCCitiesNetwork/realty) had a race condition that allowed players to generate money from thin air, fixed in [this patch](https://github.com/MCCitiesNetwork/realty/commit/97a99c9bb850ab24dd2069e56d52feac449b705f)
