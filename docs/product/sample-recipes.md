# Sample Recipes

> Seed data for Phase 1 and a reference for how the data model maps to real recipes. Each recipe below is shown in its structured form matching the `Recipe` type from `docs/ARCHITECTURE.md`.

---

## Sourdough Discard Protein Bagels

- **Source**: https://www.thisjess.com/sourdough-discard-protein-bagels/
- **Category**: bread
- **Prep time**: 30 min
- **Cook time**: 25 min
- **Servings**: 8

### Ingredients

#### For the Bagels

| Qty    | Unit       | Name                     |
|--------|------------|--------------------------|
| 0.625  | cups       | warm water               |
| 3      | tbsp       | granulated sugar         |
| 1      | tsp        | active dry yeast         |
| 4      | cups       | bread flour              |
| 1      | cup        | Greek yogurt             |
| 200    | g          | sourdough discard        |
| 2      | tsp        | kosher salt              |

#### For Topping

| Qty    | Unit       | Name                     |
|--------|------------|--------------------------|
| 1      |            | egg white                |
| 1      | tbsp       | water                    |
|        |            | toppings (e.g. everything bagel seasoning) |

### Steps

1. Combine the warm water and 1 tablespoon granulated sugar in the bowl of a stand mixer fitted with a dough hook. Sprinkle the active dry yeast on top and let sit for 5 minutes until foamy and fragrant. If your yeast does not foam, that means your yeast is dead, and you'll need to start over with fresh yeast.

2. Add the flour, Greek yogurt, sourdough discard and salt. Mix until combined and a rough dough forms. Transfer the dough to a smooth work surface and knead by hand for 4–5 minutes until the dough is smooth and soft. This will be a fairly sturdy dough and should not be sticky. If needed, add more flour or water (1 tablespoon at a time) to reach the right dough consistency.

3. Transfer the dough to a large, greased bowl, and cover with plastic wrap. Let the dough rise for 90 minutes, or until doubled in size.

4. Turn the dough out onto a smooth surface and divide into 8–10 equal pieces. 8 pieces will give you 8 large bagels; 10 pieces will give you 10 smaller bagels. Roll each piece in your palm to form a smooth ball, then use your thumb to press through the centre of each ball, stretching the hole to form your bagel. Cover the bagels with a clean kitchen towel and let rest for 20 minutes while you prepare the next step.

5. Preheat oven to 425°F (220°C). Prepare 2 baking sheets lined with parchment paper or a silicone baking mat and set aside. Bring a pot with 2 quarts of water and 2 tablespoons granulated sugar to a boil.

6. Place your bagels in the boiling water for 20–30 seconds on each side. The bagels should float (if not, cover the remaining unboiled bagels and let rest another 10 minutes, then retry). Fit 2–3 bagels in the pot at a time — make sure there is enough room for them to float freely as they will expand. Remove from the boiling water using a slotted spoon and transfer to the prepared baking sheets. If needed, reshape the bagels a little after they've cooled.

7. Whisk together the egg white and 1 tablespoon water to create the egg wash. Lightly brush the bagels with egg wash, then sprinkle with your chosen toppings (sesame seeds, poppy seeds, or everything bagel seasoning).

8. Bake for 18–22 minutes or until golden brown. Let cool fully before slicing and serving.

### Notes

- Greek yogurt should be at room temperature — cold ingredients slow the rise.
- Sourdough discard should be unfed and at room temperature (1:1 ratio starter).
- Make the bagel holes larger than you think — they shrink during boiling and baking.
- If bagels don't float in the boiling water, the dough needs more rise time.
- Adjust boiling time for texture: less time = less chewy, more time = chewier crust.
- Can substitute Greek yogurt with cottage cheese or sour cream.
- Freezes well — store in individual bags, reheat in microwave ~60 seconds.

### JSON fixture

```json
{
  "id": "sample-sourdough-bagels",
  "title": "Sourdough Discard Protein Bagels",
  "description": "Chewy sourdough bagels with 11g protein each, made with Greek yogurt and sourdough discard.",
  "category": "bread",
  "prepTimeMin": 30,
  "cookTimeMin": 25,
  "servings": 8,
  "ingredients": [
    { "name": "warm water", "quantity": 0.625, "unit": "cups" },
    { "name": "granulated sugar", "quantity": 3, "unit": "tbsp" },
    { "name": "active dry yeast", "quantity": 1, "unit": "tsp" },
    { "name": "bread flour", "quantity": 4, "unit": "cups" },
    { "name": "Greek yogurt", "quantity": 1, "unit": "cup" },
    { "name": "sourdough discard", "quantity": 200, "unit": "g" },
    { "name": "kosher salt", "quantity": 2, "unit": "tsp" },
    { "name": "egg white", "quantity": 1, "unit": "" },
    { "name": "water (egg wash)", "quantity": 1, "unit": "tbsp" },
    { "name": "toppings (e.g. everything bagel seasoning)", "quantity": null, "unit": "" }
  ],
  "steps": [
    "Combine the warm water and 1 tablespoon granulated sugar in the bowl of a stand mixer fitted with a dough hook. Sprinkle the active dry yeast on top and let sit for 5 minutes until foamy and fragrant. If your yeast does not foam, your yeast is dead — start over with fresh yeast.",
    "Add the flour, Greek yogurt, sourdough discard and salt. Mix until combined and a rough dough forms. Transfer to a smooth work surface and knead by hand for 4–5 minutes until smooth and soft. The dough should be sturdy, not sticky. Add more flour or water (1 tablespoon at a time) if needed.",
    "Transfer the dough to a large, greased bowl and cover with plastic wrap. Let rise for 90 minutes, or until doubled in size.",
    "Turn the dough out and divide into 8–10 equal pieces. Roll each piece into a smooth ball, then press your thumb through the centre and stretch to form a bagel. Make the hole larger than you think it should be. Cover with a clean kitchen towel and let rest for 20 minutes.",
    "Preheat oven to 425°F (220°C). Line 2 baking sheets with parchment paper. Bring a pot with 2 quarts of water and 2 tablespoons granulated sugar to a boil.",
    "Boil bagels for 20–30 seconds on each side. They should float — if not, let remaining bagels rest 10 more minutes and retry. Fit 2–3 at a time. Remove with a slotted spoon to the baking sheets.",
    "Whisk egg white with 1 tablespoon water. Brush bagels with egg wash and sprinkle with toppings.",
    "Bake for 18–22 minutes or until golden brown. Let cool fully before slicing."
  ],
  "sourceUrl": "https://www.thisjess.com/sourdough-discard-protein-bagels/",
  "notes": "Greek yogurt and sourdough discard must be at room temperature. Make bagel holes bigger than expected — they shrink. If bagels don't float when boiling, they need more rise time. Freezes well in individual bags.",
  "createdAt": "2026-03-13T00:00:00+13:00",
  "updatedAt": "2026-03-13T00:00:00+13:00"
}
```
