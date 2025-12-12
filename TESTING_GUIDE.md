# DiamondTrainer - Show Answer Feature Testing Guide

## Test Scenarios

### Test 1: Basic Answer Display
**Steps:**
1. Open DiamondTrainer app
2. Close the instructions overlay
3. Set Pitch Speed to 90 mph
4. Set Launch Angle to 25°
5. Click "Show Correct Answer" button

**Expected Result:**
- Answer container appears with orange background
- Shows "102 mph" as the expected exit velocity (exact match from dataset)
- Displays "✓ Your inputs match a data point exactly!"

### Test 2: Non-Exact Match
**Steps:**
1. Set Pitch Speed to 87 mph
2. Set Launch Angle to 23°
3. Click "Show Correct Answer" button

**Expected Result:**
- Answer container shows closest match information
- Displays differences between input and closest data point
- Shows the expected exit velocity from closest match
- Includes blue info note explaining the approximation

### Test 3: Answer Hides on Input Change
**Steps:**
1. Show an answer (using Test 1 steps)
2. Change Pitch Speed slider to 95 mph

**Expected Result:**
- Answer container immediately hides
- Must click "Show Answer" again to see new answer

### Test 4: Forward Pass Integration
**Steps:**
1. Set Pitch Speed to 92 mph
2. Set Launch Angle to 28°
3. Click "Take a Swing!" button
4. Click "Show Correct Answer" button

**Expected Result:**
- Forward pass results display first (your prediction)
- Answer shows expected value from dataset (105 mph for exact match)
- Can compare your model's prediction vs actual data

### Test 5: Dataset Row Click
**Steps:**
1. Scroll to "Scouting Report (Dataset)" panel
2. Click on any row in the table
3. Observe the input values update

**Expected Result:**
- Pitch Speed and Launch Angle update to match clicked row
- Answer container hides automatically
- Values display in badges with highlighting

### Test 6: Keyboard Shortcuts
**Steps:**
1. Set any input values
2. Press Ctrl+Enter (or Cmd+Enter on Mac)
3. Press Ctrl+S (or Cmd+S on Mac)

**Expected Result:**
- Ctrl+Enter triggers "Take a Swing" (forward pass)
- Ctrl+S shows the correct answer
- Both work without clicking buttons

### Test 7: Multiple Answer Requests
**Steps:**
1. Set Pitch Speed to 85 mph, Launch Angle to 20°
2. Click "Show Correct Answer"
3. Note the displayed answer (95 mph)
4. Change Pitch Speed to 96 mph
5. Click "Show Correct Answer" again

**Expected Result:**
- First answer shows 95 mph
- After input change, answer hides
- Second answer shows 110 mph
- No duplicate containers or errors

### Test 8: Answer Visibility After Training
**Steps:**
1. Set inputs to any values
2. Click "Show Correct Answer"
3. Note the answer displayed
4. Click "Run Training Session"
5. Wait for training to complete

**Expected Result:**
- Answer remains visible during training
- Can compare actual data vs model predictions
- Both metrics display correctly

### Test 9: Visual Feedback
**Steps:**
1. Move any slider slowly
2. Observe the value badge
3. Click "Show Correct Answer"
4. Observe animations

**Expected Result:**
- Value badges pulse/scale when changed
- Answer container fades in smoothly
- Orange check icon appears
- Smooth scroll to answer if below viewport

### Test 10: Edge Cases
**Steps:**
1. Set Pitch Speed to 60 mph (minimum)
2. Set Launch Angle to 0° (minimum)
3. Click "Show Correct Answer"

**Expected Result:**
- Shows closest available data point
- Displays large differences clearly
- No errors or crashes
- Informative message about approximation

## Visual Verification Checklist

✅ Answer button has orange gradient background
✅ Answer button has eye icon
✅ Answer container has orange border
✅ Answer value is large, centered, and prominent (2rem font)
✅ Animations are smooth (fadeIn, pulse)
✅ Hover effects work on all buttons
✅ Container hides/shows reliably
✅ Tooltip appears on button hover
✅ Icons display correctly throughout

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Checks

✅ Answer displays instantly (no lag)
✅ Calculations complete quickly (<100ms)
✅ Animations don't cause jank
✅ Multiple clicks don't create duplicates
✅ Memory usage stays stable

## Accessibility

✅ Button has descriptive title attribute
✅ Keyboard shortcuts work
✅ Color contrast meets standards
✅ Focus states visible
✅ Screen reader compatible

## Known Good Values (From Dataset)

| Pitch Speed | Launch Angle | Expected Exit Velocity |
|-------------|--------------|------------------------|
| 85 mph      | 20°          | 95 mph                 |
| 90 mph      | 25°          | 102 mph                |
| 95 mph      | 30°          | 108 mph                |
| 88 mph      | 22°          | 98 mph                 |
| 92 mph      | 28°          | 105 mph                |
| 96 mph      | 32°          | 110 mph                |

Use these for exact match testing!

## Success Criteria

✅ Answer displays reliably every time
✅ Visual design matches app theme (orange, baseball aesthetic)
✅ User flow is intuitive and clear
✅ No JavaScript errors in console
✅ Works across all breakpoints (mobile, tablet, desktop)
✅ Answers are accurate based on dataset
✅ Container hides when appropriate
✅ Multiple uses work without issues
