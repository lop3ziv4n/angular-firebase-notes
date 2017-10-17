import {Component} from '@angular/core';
import {Note} from './note';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  my_notes: any;
  my_notes_offline = [];
  show_form = false;
  editing = false;
  note: Note = new Note();

  constructor(public afDB: AngularFireDatabase) {
    if (navigator.onLine) {
      this.getAllNotes()
        .subscribe(
          notes => {
            this.my_notes = notes;
            localStorage.setItem('my_notes', JSON.stringify(this.my_notes));
          });
    } else {
      this.my_notes = JSON.parse(localStorage.getItem('my_notes'));
    }

    setInterval(() => {
      if (navigator.onLine && this.my_notes_offline.length > 0) {
        this.synchronize();
      }
    }, 5000);
  }

  getAllNotes() {
    return this.afDB.list('notes').valueChanges();
  }

  addNote() {
    this.editing = false;
    this.show_form = true;
    this.note = new Note();
  }

  cancelNote() {
    this.editing = false;
    this.show_form = false;
    this.note = new Note();
  }

  saveNote() {
    if (this.editing) {
      if (navigator.onLine) {
        this.afDB.database.ref('notes/' + this.note.id).set(this.note);
      } else {
        this.my_notes.forEach((note) => {
          if (note.id === this.note.id) {
            note = this.note;
          }
        });
        this.my_notes_offline.push({
          id: this.note.id,
          note: this.note,
          action: 'edit',
        });
      }
    } else {
      if (navigator.onLine) {
        this.note.id = Date.now();
        this.afDB.database.ref('notes/' + this.note.id).set(this.note);
      } else {
        this.my_notes.push(this.note);
        this.my_notes_offline.push({
          id: this.note.id,
          note: this.note,
          action: 'create',
        });
      }
    }
    this.show_form = false;
    localStorage.setItem('my_notes', JSON.stringify(this.my_notes));
  }

  selectedNote(note) {
    this.note = note;
    this.show_form = true;
    this.editing = true;
  }

  deleteNote() {
    if (navigator.onLine) {
      this.afDB.database.ref('notes/' + this.note.id).remove();
    } else {
      this.my_notes.forEach((note, index) => {
        if (note.id === this.note.id) {
          this.my_notes.slice(index, 1);
        }
      });
      this.my_notes_offline.push({
        id: this.note.id,
        action: 'delete',
      });
    }
    this.show_form = false;
    localStorage.setItem('my_notes', JSON.stringify(this.my_notes));
  }

  synchronize() {
    this.my_notes_offline.forEach((record) => {
      switch (record.action) {
        case 'create' :
          this.afDB.database.ref('notes/' + record.id).set(record.note);
          break;
        case 'edit' :
          this.afDB.database.ref('notes/' + record.id).set(record.note);
          break;
        case 'delete' :
          this.afDB.database.ref('notes/' + record.id).remove();
          break;
        default:
          console.log('Action unknown');
      }
      this.my_notes_offline.shift();
    });
  }
}
