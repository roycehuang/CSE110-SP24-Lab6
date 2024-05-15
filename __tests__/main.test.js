describe('Basic user flow for Website', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/index.html');
  });

  //Add new note
  it('Adding a Note', async () => {
    console.log('Adding a Note...');
    const addNoteButton = await page.$('button');
    await addNoteButton.click();
    let status = false;
    if (await page.$('textarea')){
      status = true;
    }
    expect(status).toBe(true);
  }, 10000);

  //Edit existing note
  it('Updating Notes', async () => {
    const updatedText = await page.$eval('textarea', textarea => {
      textarea.value = 'UPDATED NOTE!';
      return textarea.value;
    });
    expect(updatedText).toBe('UPDATED NOTE!');
  }, 10000);

  //Notes are still there after reloading
  it('Updating Notes', async () => {
    let status = false;
    const newText = await page.$eval('textarea', textarea => {
      return textarea.value;
    })
    if (await page.$('textarea') && (newText == 'UPDATED NOTE!')){
      status = true;
    }
    expect(status).toBe(true);
  }, 10000);

  //delete individually (double clicking on the note)
  it('Delete Individual Note', async () => {
    //unfocus the note
    await page.bringToFront();
    //double click to delete
    await page.click('textarea', {clickCount: 2});
    const noteDeleted = await page.$('textarea');
    expect(noteDeleted === null);
  }, 10000);

  //create many notes
  it('Create Many Notes', async () => {
    const addNoteButton = await page.$('button');
    await addNoteButton.click();
    await addNoteButton.click();
    await addNoteButton.click();
    await addNoteButton.click();
    await addNoteButton.click();
    const noteItems = await page.$$('textarea');
    const numNotes = noteItems.length;
    expect(numNotes).toBe(5);
  }, 10000);

  //delete all shift + ctrl + d
  it('Delete All Notes', async () => {
    page.on('dialog', async dialog => {
      console.log(dialog.message());
      await dialog.accept();
    });
    await page.keyboard.down('Shift');
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyD');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyD');
    
    const noteItems = await page.$$('textarea');
    console.log(noteItems);
    const numNotes = noteItems.length;
    expect(numNotes).toBe(0);
  }, 1000000);
});