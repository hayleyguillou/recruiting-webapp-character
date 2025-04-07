# Hayley Guillou - Take Home Assignment

Completed requirements 1-5, 7

## Next steps:
- Break sections down into components (Displaying Attributes, Classes, Skills) and separate test files per component
- Create Character component for loading specific character profiles
- Fix CSS styling


## Requirements

1. Create state and controls for each of the 6 attributes (see `ATTRIBUTE_LIST`) so they can be incremented/decremented independently.
2. Display classes on the screen (see `CLASS_LIST`) and visually change the UI when the character meets the minimum requirements for that class, that is, all attributes are greater than or equal to the class minimums
3. When clicking on a class, display the minimum required statistics for that class
4. Add an “ability modifier” to each attribute row, this is calculated as +1 for each 2 points above 10, for any attribute (let's take Intelligence for example) we would have the following ability modifiers for a given ability
  - Intelligence: 7 -> Intelligence Modifier: -2
  - Intelligence: 9 -> Intelligence Modifier: -1
  - Intelligence: 10 -> Intelligence Modifier: 0
  - Intelligence: 11 -> Intelligence Modifier: 0
  - Intelligence: 12 -> Intelligence Modifier: 1
  - Intelligence: 14 -> Intelligence Modifier: 2
  - Intelligence: 20 -> Intelligence Modifier: 5
5. Implement skills. See `SKILL_LIST` for the list of all skills and their attribute modifier 
  - Characters have 10 + (4 * Intelligence Modifier) points to spend between skills.
    - There is a minimum of 0, but no maximum aside from the total points available to spend.
    - for example, if a character has a 1 Intelligence Modifier, they may spend 14 points, and could add 7 to both Acrobatics and Perception (then would have no more to spend on others)
  - The total value of a skill is the sum of points spent and the skill’s corresponding ability modifier (see `SKILL_LIST` for what ability modifier affects each skill). 
    - For example. a character with a 2 Dexterity Modifier and spending 3 points on Acrobatics would have a total skill value of 5
  - Display each skill in a row in a separate section. For example, Acrobatics 
    - for a character with 12 dexterity may look like `Acrobatics - points: 3 [+] [-] modifier (Dex): 2 total: 5`
6. Save the character(s) to an API so they can be retrieved when the app starts next time. 
    - Make a post request with a JSON payload to https://recruiting.verylongdomaintotestwith.ca/api/{{github_username}}/character to save data, and a get request to https://recruiting.verylongdomaintotestwith.ca/api/{{github_username}}/character to retrieve the data. It will accept any valid JSON blob and return the most recent version
    - for example, if your github username is mjohnston, you would use https://recruiting.verylongdomaintotestwith.ca/api/{mjohnston}/character (include the curly braces)
    - you must include a content-type header of application/json for the post to be accepted 
7. Implement a maximum on all attributes of 70. For example, if a character has 20 strength and 10 for all other attributes, they must decrease one before they can increase another
8. Add the ability to edit multiple characters simultaneously with the same rules above
9. Add a Skill Check section for each character. This represents a character's attempt to perform an action
    - the character is successful if they meet or exceed the DC (see below) of the skill check. Add the total skill to a random number between 1 and 20 inclusive, if this meets or exceeds the DC the skill check is successful, otherwise it's a failure
    - Add the following controls to the UI
      - skill: a dropdown to specify what skill we're using in the check, see `SKILL_LIST`
      - DC: An input that collects a number. The minimum value the character must meet to succeed
      - Roll: a button that will trigger the random number generation
    - When the Roll button is clicked, display the following
      - What the random number generated was
      - If the skill check is successful or a failure
10. Add a party skill check section. This is the same as the above, except we should use the character with the highest skill total to attempt the action
  - Show which character was selected to attempt the action
