ULM Football Intelligence Platform V1.7

P & 10 FIX
The previous build required an explicit possession or drive marker. The current
Supabase play rows did not provide one, so P & 10 never appeared.

This build now identifies the first play of a possession using:
- Explicit possession/drive IDs or start flags
- First offensive play of each game
- A change in the offense from the previous play
- The play following a punt, turnover, touchdown, safety or end-of-possession event
- Sequence resets when available

P & 10 is assigned only when that inferred possession-opening play is exactly
1st down and 10 yards to go.

1st & 10 remains a separate exact bucket for all other first-and-10 plays.

The new bucket is used by:
- Global down-distance filters
- First Down Explorer
- Situations reports
- Every formation and team table grouped by down-distance
