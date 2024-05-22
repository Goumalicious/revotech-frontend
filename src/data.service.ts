import { Injectable } from '@angular/core';
import { Island } from './models/island.model';
import Parse from 'parse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  islandsArray: BehaviorSubject<Island[]> = new BehaviorSubject(null);
  user: BehaviorSubject<Parse.User> = new BehaviorSubject<Parse.User>(null);
  constructor() {
    Parse.initialize('P0c6Z9PqNdOXdtd6zXk7sMqbKPNdzMQi9E');
    Parse.serverURL = 'http://localhost:5000/parse';
    Parse.masterKey = 'qAFJd3dIYVkWEg4oNpVg5NtDfmciEWJWUb8';

    this.getAllIslands();
    this.user.next(this.getCurrentUser());
  }

  async getAllIslands() {
    const Islands = Parse.Object.extend('Islands');
    const query = new Parse.Query(Islands);
    query.ascending('order');

    const results = await query.find();
    const islands = [];
    for (const island of results) {
      const objAttributes = island.attributes
      islands.push(Object.assign({}, objAttributes, { objectId: island.id }) as any)
    }
    this.islandsArray.next(islands)
  }

  async saveIsland(objectId: string, data: any) {
    const Islands = Parse.Object.extend('Islands');
    const query = new Parse.Query(Islands);

    try {
      const results = await query.get(objectId);
      Object.keys(data).forEach(key => {
        results.set(key, data[key]);
      });

      return await results.save();
    } catch (error) {
      console.error('Error while updating object', error);
      throw error;
    }
  }


  async loginUser(username: string, password: string): Promise<boolean> {
    const loggedInUser = await Parse.User.logIn(username, password);
    if (loggedInUser) {
      this.user.next(loggedInUser);
    }
    return !!loggedInUser;
  }

  logoutUser(): Promise<any> {
    this.user.next(null);
    return Parse.User.logOut();
  }

  isLoggedIn(): boolean {
    return !!Parse.User.current();
  }

  getCurrentUser(): Parse.User | null {
    return Parse.User.current();
  }
}
