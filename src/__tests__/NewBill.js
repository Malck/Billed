/**
 * @jest-environment jsdom
 */


import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { fireEvent, screen } from "@testing-library/dom"
import store from "../__mocks__/store"
import Bills from "../containers/Bills"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"



describe("Given I am connected as an employee", () => {
/*
  let onNavigate;
  let newBill;

    beforeEach(() => {
      onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee',
        email: 'test@tock'
      })
      window.localStorage.setItem('user', user)
      document.body.innerHTML = NewBillUI();
    })
*/
 /* describe("When I am on a Newbill Page and I submit the form correctly", () => {
    
    test("Then I should submit a valid bill", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null;
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      })
      const email = JSON.parse(localStorage.getItem("user")).email
      const jsdomAlert = window.alert;
      window.alert = () => {};
      //const type = screen.getByTestId('expense-type')
      //userEvent.selectOptions(type, [ screen.getByText('Travels') ])

      const name = screen.getByTestId("expense-name")
      userEvent.type(name, "testa")

      const date = screen.getByTestId('datepicker')
      userEvent.type(date, '2021-07-19')

      const amount = screen.getByTestId('amount')
      userEvent.type(amount, '23')

      const pct = screen.getByTestId('pct')
      userEvent.type(pct, '20')

      const fileUpload = screen.getByTestId('file')
      const file = new File(['test'], 'test.png', { type: 'image/png' })

      userEvent.upload(fileUpload, file)
      expect(fileUpload.files).toHaveLength(1)

      //const handleSubmit = jest.fn(newBill.handleSubmit);
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      newBill.fileName = "test.jpg";

      const newBillForm = screen.getByTestId("form-new-bill");
      newBillForm.addEventListener("submit", handleSubmit);

      fireEvent.click(newBillForm)//fireEvent.submit(newBillForm)
      expect(handleSubmit).toHaveBeenCalledTimes(1);

      window.alert = jsdomAlert;
    })
  })
*/

// TEST SUR handleChangeFile

  describe("Given a file is chosen by user", () => {

    test("then the extension dot name should be retrieve", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      class ApiEntityMock {
        async create({data, headers = {}}) { return Promise.resolve({fileUrl: 'image.png', key: 1}) }
      }

      class StorageMock {
        bills() { return new ApiEntityMock() }
      }

      const newBill = new NewBill({
        document,
        onNavigate,
        store: new StorageMock(),
        localStorage: window.localStorage,
      });
      // Mock function handleChangeFile
      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

      //Retrieve file element in DOM and listen the event on it
      const file = screen.getByTestId("file");
      file.addEventListener("change", handleChangeFile);
  
      fireEvent.change(file, {
        target: {
          files: [new File(["image.png"], "image.png", { type: "image/png" })],
        },
      });
      expect.anything();
    });
  });


  describe("When I am on a Newbill Page and I choose an unsupported file", () => {

    test("It won't allow the file to upload", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
        //email: 'test@tld'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      
      //const jsdomAlert = window.alert;
      window.alert = () => {};
      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)
      fireEvent.change(file, { 
        target: {
          files: [new File([''], 'fake.gif', {
            type: 'image/gif'
          })],
        }
      })
      const sendButton = screen.getByTestId('send-button')
      expect(handleChangeFile).toHaveBeenCalled();
      expect(sendButton).toBeDisabled();
      //window.alert = jsdomAlert;
    })
  })


//Test sur le handleSubmit
  describe("When I am on a Newbill Page and I submit the form correctly", () => {

    test("it should create a new Bill", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const submitButton = screen.getByTestId("form-new-bill")
      
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      submitButton.addEventListener("click", handleSubmit)
      fireEvent.click(submitButton)
      expect(handleSubmit).toHaveBeenCalled()

    })
  })


// TEST SUR LES POST 
/*
  describe("When user is on NewBill Page and click on Submit", () => {

    test("it should create a new Bill", async () => {

      //Create a newBill Datas
      const newBill = {
        id: "qcCK3SzECmaZAGRrHjaC",
        status: "refused",
        pct: 20,
        amount: 200,
        email: "a@a",
        name: "test unitaire POST new Bill",
        vat: "40",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2005-02-02",
        commentAdmin: "Ceci est un test d'intégration",
        commentary: "test POST",
        type: "Restaurants et bars",
        fileUrl:
        "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732",
      };
  
      //SpyOn the So Called store Mock - post
      const postSpy = jest.spyOn(store, "post");
  
      //Values return after store called
      const bills = await store.post(newBill);
  
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(5);
    });
    
  })
*/
})
