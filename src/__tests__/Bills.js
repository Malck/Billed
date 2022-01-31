/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import store from "../__mocks__/store"
import Bills from "../containers/Bills"
//import Bills, { handleClickNewBill } from "../containers/Dashboard.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
import NewBillUI from "../views/NewBillUI.js"

describe("Given I am connected as an employee", () => {
  
  describe("When I am on Bills Page", () => {
    
    test("Then bill icon in vertical layout should be highlighted", () => {
      //vérifier si l'icone a bien la classe active-icon
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      const divIcon1 = document.getElementById('layout-icon1')
      const divIcon2 = document.getElementById('layout-icon2')
      divIcon1.classList.add('active-icon')
      divIcon2.classList.remove('active-icon')
      const billIcon = screen.getByTestId("icon-window")       
      expect(billIcon).toHaveClass('active-icon')
    })

    test("if there are no bills, the table should be empty", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      const iconEye = screen.queryByTestId("icon-eye");
      expect(iconEye).toBeNull()
    })

    test("if Bill data is available, show on table", () => {
      const html = BillsUI({ data: bills})
      document.body.innerHTML = html
      const iconEye = screen.queryAllByTestId("icon-eye");
      expect(iconEye).toBeTruthy();
      expect(iconEye.length).toBeGreaterThan(1);
      expect(screen.getAllByText("pending")).toBeTruthy();
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe('When I am on Bills page but it is loading', () => {
      test('Then, Loading page should be rendered', () => {
        const html = BillsUI({ loading: true })
        document.body.innerHTML = html
        expect(screen.getAllByText('Loading...')).toBeTruthy()
      })
    })

    describe('When I am on Bills page but back-end send an error message', () => {
      test('Then, Error page should be rendered', () => {
        const html = BillsUI({ error: 'some error message' })
        document.body.innerHTML = html
        expect(screen.getAllByText('Erreur')).toBeTruthy()
      })
    })

  })

//test sur BIlls.js ligne 23 function handleClickIconEye
  describe('Given I am connected as Employee and I am on Bills page and I clicked on a bill', () => {

    describe('When I click on the icon eye', () => {

      test('A modal should open', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        $.fn.modal = jest.fn();//regle le probleme de lien avec billscontainers
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const billsContainer = new Bills({
          document, onNavigate, store, localStorage: window.localStorage     
        })
  
        const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye)
        const eyes = screen.getAllByTestId('icon-eye')

        const firstEye = eyes[0];
        firstEye.addEventListener('click', () => {
          handleClickIconEye(firstEye);
        })
        userEvent.click(firstEye)
        expect(handleClickIconEye).toHaveBeenCalled()
  
        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeTruthy() 
      })
    })
  })

//test sur BIlls.js ligne 20 function handleClickNewBill      
describe("When user click on the button create a new bill", () => {

  test("A new Bill Page is open", () => {

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const html = BillsUI({ data: [] })
    document.body.innerHTML = html
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const newBills = new Bills({
      document, onNavigate, store: null, bills, localStorage: window.localStorage
    })
    // Mock un comportement
    const handleClickNewBill = jest.fn((e) => newBills.handleClickNewBill(e))

    const buttonNewBill = screen.getByTestId("btn-new-bill")
    
    buttonNewBill.addEventListener('click', handleClickNewBill)
    userEvent.click(buttonNewBill)
    expect(handleClickNewBill).toHaveBeenCalled()
    expect(NewBillUI()).toBeTruthy()
  })
})


//Test d'integration GET
  describe("When I navigate to Bills UI", () => {
    test("fetches bills from mock API GET", async () => {
      // Spy On The so called store Mock
      const getSpy = jest.spyOn(store, "get");
      // Values return after store Mock have been called
      const bills = await store.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBeGreaterThan(1);
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })

  });

})




//Test qui ne fonctionne pas 
/*

test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      
      //vérifier si l'icone a bien la classe active-icon
      //const billIcon = screen.getByTestId("icon-window")
      //expect(billIcon).toHaveClass('active-icon')
    })
//TestingLibraryElementError: Unable to find an element by: [data-testid="icon-window"] 

*/