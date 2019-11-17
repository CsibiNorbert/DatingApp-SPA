import { Component, OnInit } from "@angular/core";
import { Message } from "../_models/message";
import { Pagination, PaginatedResult } from "../_models/Pagination";
import { UserService } from "../_services/user.service";
import { AuthService } from "../_services/auth.service";
import { AlertifyService } from "../_services/alertify.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"]
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = "Unread";

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // we are getting the data
    this.route.data.subscribe(data => {
      this.messages = data["messages"].result;
      this.pagination = data["messages"].pagination;
    });
  }

  loadMessages() {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    console.log(event + ' event');
    console.log(event.page + ' event.page');
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(messageId: number){
    this.alertify.confirm("Are you sure you want to delete this message?", () => {
      // Annonymous function because we don`t return anything back
      this.userService.deleteMessage(messageId, this.authService.decodedToken.nameid).subscribe(() => {
        // find the index of the X message and delete 1 of these
        this.messages.splice(this.messages.findIndex(m => m.id === messageId), 1);
        this.alertify.success("Message has been deleted");
      }, error => {
        this.alertify.error("Message could not be deleted");
      });
    });
  }
}
